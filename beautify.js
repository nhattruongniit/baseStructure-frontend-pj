var through = require('through2');

module.exports = function (options) {

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            return cb(null, file); // pass along
        }
        if (file.isStream()) {
            return cb(new Error('Module beautify: Streaming not supported'));
        }

        options = Object.assign({
            beautifier: null
        }, options || {});

        var beautifier = options.beautifier || require('js-beautify');
        var str = file.contents.toString('utf-8');

        file.contents = new Buffer(beautifier(str, options));

        cb(null, file);
    });

};
