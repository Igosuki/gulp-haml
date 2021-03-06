var map = require('map-stream');
var rext = require('replace-ext');
var gutil = require('gulp-util');
var haml = require('haml');

module.exports = function(options) {
  var layoutContent = null;
  if(!options) options = {};
  if(!options.ext) options.ext = '.html';
  if(options.layout) layoutContent = new gutil.File({path:options.layout}).contents.toString("utf8");

  // Map each file to this function
  function hamlStream(file, cb) {
    // Remember that contents is ALWAYS a buffer
    if (file.isNull()) return cb(null, file); // pass along
    if (file.isStream()) return cb(new Error("gulp-haml: Streaming not supported"));

    var html = haml.render(file.contents.toString("utf8"), options);
    if(options.layout)
      html = haml.render(layoutContent, {locals: {content:html}});
    file.path = rext(file.path, options.ext);
    file.contents = new Buffer(html);

    cb(null, file);
  }

  // Return a stream
  return map(hamlStream);
};
