# frozen_string_literal: true
# Reciprocal language links, built from real translated posts and native archive URLs.
require 'json'
require 'yaml'
require 'date'

module M0ss1Languages
  module_function

  def metadata(path)
    text = File.read(path, encoding: 'UTF-8')
    block = text.match(/\A---\s*\n(.*?)\n---\s*\n/m)
    raise Jekyll::Errors::FatalException, "Missing front matter: #{path}" unless block
    YAML.safe_load(block[1], permitted_classes: [Date, Time], aliases: true) || {}
  end

  def terms(value)
    value.is_a?(Array) ? value.map(&:to_s) : value.to_s.split
  end

  def translated_posts(site)
    root = site.config['content_repository'] || site.source
    files = Dir.glob(File.join(root, '_translations/en/_posts/*.{md,html}'))
    files.each_with_object({}) do |file, out|
      data = metadata(file)
      key = data['translation_key']
      path = data['permalink']
      unless key && path&.start_with?('/') && !path.start_with?('/en/')
        raise Jekyll::Errors::FatalException, "Translation requires a key and unprefixed permalink: #{file}"
      end
      raise Jekyll::Errors::FatalException, "Duplicate translation key: #{key}" if out.key?(key)
      out[key] = data
    end
  end

  def greek_routes(site)
    english = translated_posts(site)
    paths = {}
    taxonomy = { 'category' => {}, 'tag' => {} }
    posts = []
    site.posts.docs.each do |post|
      key = post.data['translation_key']
      other = english.delete(key)
      raise Jekyll::Errors::FatalException, "English translation missing: #{post.path}" unless other
      pair = { 'el' => post.url, 'en' => '/en' + other.fetch('permalink') }
      pair.each_value { |path| paths[path] = pair }
      posts << { 'key' => key, 'paths' => pair }
      { 'category' => 'categories', 'tag' => 'tags' }.each do |kind, field|
        greek = terms(post.data[field]); translated = terms(other[field])
        unless greek.size == translated.size
          raise Jekyll::Errors::FatalException, "Taxonomy mismatch: #{key} / #{field}"
        end
        greek.zip(translated).each do |from, to|
          known = taxonomy[kind][from]
          raise Jekyll::Errors::FatalException, "Inconsistent #{kind}: #{from} => #{known} / #{to}" if known && known != to
          taxonomy[kind][from] = to
        end
      end
    end
    raise Jekyll::Errors::FatalException, "Unpaired English posts: #{english.keys.join(', ')}" unless english.empty?
    # Native Jekyll archives expose type/title methods rather than ordinary front matter.
    candidates = site.pages + site.collections.fetch('tabs').docs
    candidates.each do |page|
      next unless page.url.end_with?('/', '.html')
      other = '/en' + page.url
      if page.respond_to?(:type) && %w[category tag].include?(page.type)
        translated = taxonomy.fetch(page.type)[page.title]
        raise Jekyll::Errors::FatalException, "Missing archive translation: #{page.title}" unless translated
        slug = Jekyll::Utils.slugify(translated, mode: site.config.dig('jekyll-archives', 'slug_mode'))
        prefix = page.type == 'category' ? 'categories' : 'tags'
        other = "/en/#{prefix}/#{slug}/"
      end
      pair = { 'el' => page.url, 'en' => other }
      pair.each_value { |path| paths[path] = pair }
    end
    { 'paths' => paths, 'posts' => posts, 'taxonomy' => taxonomy }
  end

  def attach(site)
    english = site.config['content_language'] == 'en'
    routes = if english
               JSON.parse(File.read(site.config.fetch('i18n_routes_file')))
             else
               greek_routes(site)
             end
    site.config['i18n_generated_routes'] = routes
    candidates = site.pages + site.collections.values.flat_map(&:docs)
    candidates.each do |page|
      path = (english ? '/en' : '') + page.url
      pair = routes['paths'][path]
      next unless pair
      page.data['alternate_urls'] = pair.transform_values { |url| site.config.fetch('url').sub(%r{/$}, '') + url }
      page.data['alternate_urls']['x_default'] = page.data['alternate_urls']['el']
      page.data['content_language'] = english ? 'en' : 'el'
    end
  end
end

Jekyll::Hooks.register :site, :pre_render do |site|
  M0ss1Languages.attach(site) if site.config['bilingual']
end
Jekyll::Hooks.register :site, :post_write do |site|
  next unless site.config['bilingual'] && site.config['content_language'] != 'en'
  File.write(File.join(site.dest, 'i18n-map.json'), JSON.pretty_generate(site.config.fetch('i18n_generated_routes')) + "\n")
end
