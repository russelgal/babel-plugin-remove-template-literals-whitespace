/**
 * @author Oliver Findl
 * @version 1.0.3
 * @license MIT
 */

"use strict";

const { declare } = require("@babel/helper-plugin-utils");

const REQUIRED_BABEL_VERSION = 7;

const PATTERN_COMMENT = /\s*?\/\/.*/g;
const PATTERN_WHITESPACE_NON_BREAKABLE_SPACE = /[\s\uFEFF]*\xA0[\s\uFEFF]*/g;
const PATTERN_WHITESPACE_EXCEPT_SPACE = /[\r\n\t\f\v\uFEFF\xA0]+/g;
const PATTERN_WHITESPACE = /[\s\uFEFF\xA0]+/g;

const removeWhitespace = (string = "") => string
	.toString()
	.replace(PATTERN_COMMENT, "")
	.replace(PATTERN_WHITESPACE_NON_BREAKABLE_SPACE, "&nbsp;")
	.replace(PATTERN_WHITESPACE_EXCEPT_SPACE, "")
	.replace(PATTERN_WHITESPACE, " ");

// eslint-disable-next-line no-unused-vars
module.exports = declare(({ assertVersion }, options = {}, dirname = "") => {
	assertVersion(REQUIRED_BABEL_VERSION);

	// eslint-disable-next-line no-cond-assign
	if((options.verbose = !!options.verbose) && !("table" in console)) throw new Error("`console.table` not supported!");

	const fn = typeof options.fn === "function" ? options.fn : removeWhitespace;

	return {
		name: "remove-template-literals-whitespace",
		visitor: {
			TemplateLiteral: path => {
				const { node: { quasis } } = path;

				for(const elem of quasis) {
					const { value } = elem;
					const { raw, cooked } = value;

					value.raw = fn.call(null, raw);
					value.cooked = fn.call(null, cooked);

					options.verbose && console.table([{
						value: "raw",
						before: raw,
						after: value.raw
					}, {
						value: "cooked",
						before: cooked,
						after: value.cooked
					}]);
				}
			}
		}
	};
});
