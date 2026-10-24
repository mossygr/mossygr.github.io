#!/usr/bin/env ruby
# frozen_string_literal: true
# Build both complete, independent language sites with the same official theme.
require 'bundler/setup'
require 'fileutils'
require 'tmpdir'
require 'yaml'
require 'json'
require 'date'
require 'rbconfig'
require 'nokogiri'

ROOT = File.expand_path('..', __dir__)
DEST = File.expand_path(ENV.fetch('SITE_DESTINATION', '_site'), ROOT)
EN_SOURCE = File.join(ROOT, '_translations/en')
JEKYLL = Gem.bin_path('jekyll', 'jekyll')

# Translation data only changes human-readable labels. Wiring IDs, coordinates,
# pin numbers, units, colors and the electrical model come from one shared source.
def natural_greek?(text)
  text.delete('Ω').match?(/\p{Greek}/)
end

def localize_text(text, dictionary)
  return text unless natural_greek?(text)
  key = text.gsub(/\s+/, ' ').strip
  value = dictionary.fetch(key) { raise "Untranslated robot label: #{key.inspect}" }
  raise "Empty robot label: #{key}" if value.empty?
  text[/\A\s*/] + value + text[/\s*\z/]
end

def localize_markup(file, dictionary)
  original = File.read(file)
  document = if File.extname(file) == '.svg'
               Nokogiri::XML(original) { |config| config.strict.nonet }
             else
               Nokogiri::HTML::DocumentFragment.parse(original)
             end
  document.xpath('.//text()').each { |node| node.content = localize_text(node.text, dictionary) }
  document.xpath('.//*[@aria-label or @title]').each do |node|
    %w[aria-label title].each { |name| node[name] = localize_text(node[name], dictionary) if node[name] }
  end
  output = File.extname(file) == '.svg' ? document.root.to_xml : document.to_html
  File.write(file, output + "\n")
end

def run_build(source, destination, config)
  puts "\nBuilding #{config.fetch('content_language')} -> #{destination}"
  Dir.mktmpdir('m0ss1-jekyll-config-') do |temporary|
    override = File.join(temporary, 'runtime.yml')
    File.write(override, YAML.dump(config))
    ok = system({ 'JEKYLL_ENV' => 'production' }, RbConfig.ruby, JEKYLL, 'build',
                '--source', source, '--destination', destination,
                '--config', File.join(source, '_config.yml') + ',' + override,
                '--disable-disk-cache', chdir: ROOT)
    raise "Jekyll #{config.fetch('content_language')} build failed" unless ok
  end
end

base = YAML.safe_load(File.read(File.join(ROOT, '_config.yml')), aliases: true)
raise 'Expected official Chirpy theme' unless base['theme'] == 'jekyll-theme-chirpy'
run_build(ROOT, DEST, { 'content_language' => 'el', 'content_repository' => ROOT })
map_path = File.join(DEST, 'i18n-map.json')
raise 'Greek build did not emit the reciprocal route map' unless File.file?(map_path)
routes = JSON.parse(File.read(map_path))

Dir.mktmpdir('m0ss1-english-source-') do |stage|
  # Copy site sources only. No git data, credentials, audit files or local tools.
  %w[_config.yml _data _includes _layouts _plugins _tabs _posts assets index.html].each do |name|
    original = File.join(ROOT, name)
    FileUtils.cp_r(original, File.join(stage, name)) if File.exist?(original)
  end
  %w[_posts _tabs].each do |name|
    source = File.join(EN_SOURCE, name)
    raise "Missing translated content directory: #{source}" unless Dir.exist?(source)
    FileUtils.rm_rf(File.join(stage, name))
    FileUtils.cp_r(source, File.join(stage, name))
  end
  overlays = File.join(EN_SOURCE, '_includes')
  Dir.glob(File.join(overlays, '**/*')).select { |file| File.file?(file) }.each do |file|
    relative = file.delete_prefix(overlays + '/')
    target = File.join(stage, '_includes', relative)
    FileUtils.mkdir_p(File.dirname(target)); FileUtils.cp(file, target)
  end
  dictionary = JSON.parse(File.read(File.join(EN_SOURCE, 'robot-labels.json')))
  %w[pict.svg harness.svg t-table.html].each do |name|
    localize_markup(File.join(stage, '_includes/robot', name), dictionary)
  end
  script_path = File.join(stage, 'assets/robot/guide.js')
  script = File.read(script_path)
  match = script.match(/^const WD=(.*);$/)
  raise 'Missing shared wire data' unless match
  data = JSON.parse(match[1])
  data.each_value { |wire| wire.transform_values! { |value| value.is_a?(String) ? localize_text(value, dictionary) : value } }
  script.sub!(match[0], 'const WD=' + JSON.generate(data) + ';')
  script.gsub!('aria-label="Κλείσιμο"', 'aria-label="Close"')
  script.gsub!("['λευκό','κίτρινο','γαλάζιο','πόδι']", "['white','yellow','cyan','lead']")
  File.write(script_path, script)
  config = {
    'lang' => 'en', 'baseurl' => '/en', 'content_language' => 'en',
    'content_repository' => ROOT, 'i18n_routes_file' => map_path,
    'tagline' => 'A tech wanderer, trying to unplug.',
    'description' => 'Projects, retro gaming and cybersecurity notes by m0ss1.'
  }
  run_build(stage, File.join(DEST, 'en'), config)
end

# Both languages share cacheable media/theme assets. Only translated search data
# and localized robot interaction data need language-specific asset URLs.
protected_assets = %w[js/data/search.json robot/guide.js]
Dir.glob(File.join(DEST, 'en/**/*')).select { |file| File.file?(file) && %w[.html .xml .json .js .css].include?(File.extname(file)) }.each do |file|
  next if file.include?('/assets/')
  text = File.read(file)
  text.gsub!(%r{/en/assets/(?!js/data/search\.json|robot/guide\.js)}, '/assets/')
  File.write(file, text)
end
english_assets = File.join(DEST, 'en/assets')
keep = protected_assets.to_h { |name| [name, File.binread(File.join(english_assets, name))] }
FileUtils.rm_rf(english_assets)
keep.each do |name, content|
  target = File.join(english_assets, name); FileUtils.mkdir_p(File.dirname(target)); File.binwrite(target, content)
end
# The domain-level robots file advertises both valid language sitemaps.
robots = File.join(DEST, 'robots.txt')
text = File.read(robots)
english_sitemap = base.fetch('url').sub(%r{/$}, '') + '/en/sitemap.xml'
File.write(robots, text.rstrip + "\nSitemap: #{english_sitemap}\n") unless text.include?(english_sitemap)
report = {
  'languages' => %w[el en], 'posts_per_language' => routes.fetch('posts').size,
  'paired_routes' => routes.fetch('paths').size / 2,
  'source_commit' => IO.popen(['git', '-C', ROOT, 'rev-parse', 'HEAD'], &:read).strip,
  'shared_assets' => true
}
File.write(File.join(DEST, 'build-info.json'), JSON.pretty_generate(report) + "\n")
puts "\nBilingual build complete: #{report.to_json}"
