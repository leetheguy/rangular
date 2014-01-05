# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'rangular/version'

Gem::Specification.new do |spec|
  spec.name          = "rangular"
  spec.version       = Rangular::VERSION
  spec.authors       = ["Lee Nathan"]
  spec.email         = ["leetheguy@gmail.com"]
  spec.description   = %q{put AJAX data updates in your HTML without writing JS}
  spec.summary       = %q{
                          Rangular empowers skilled Rails developers to add AJAX to their sites quickly and easily.
                          Rangular uses the power of the Angular framework to allow AJAX calls to be made to a Rails server without writing Javascript.
                         }
  spec.homepage      = "https://github.com/leetheguy/rangular"
  spec.license       = "MIT"

  spec.files         = `git ls-files`.split($/)
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.3"
  spec.add_development_dependency "rake"
end
