# frozen_string_literal: true
require 'open3'
require 'pathname'

# Resolve the real source file even when an English build uses a temporary source tree.
Jekyll::Hooks.register :posts, :post_init do |post|
  root = post.site.config['content_repository'] || post.site.source
  file = if post.site.config['content_language'] == 'en'
           File.join(root, '_translations/en/_posts', File.basename(post.path))
         else
           File.expand_path(post.path, post.site.source)
         end
  relative = Pathname.new(file).relative_path_from(Pathname.new(root)).to_s
  next if relative.start_with?('../')
  count, status = Open3.capture2('git', '-C', root, 'rev-list', '--count', 'HEAD', '--', relative)
  next unless status.success? && count.to_i > 1
  date, status = Open3.capture2('git', '-C', root, 'log', '-1', '--format=%cI', '--', relative)
  post.data['last_modified_at'] = date.strip if status.success? && !date.strip.empty?
end
