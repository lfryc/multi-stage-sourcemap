"use strict";
var sourceMap = require("source-map");
var Generator = sourceMap.SourceMapGenerator;
var Consumer = sourceMap.SourceMapConsumer;
/**
 * return re-mapped rawSourceMap string
 * @param {object} mappingObject
 * @param {string} mappingObject.fromSourceMap
 * @param {string} mappingObject.toSourceMap
 * @returns {string}
 */
function transfer(mappingObject) {
    var fromSourceMap = mappingObject.fromSourceMap;
    var toSourceMap = mappingObject.toSourceMap;
    var fromSMC = new Consumer(fromSourceMap);
    var toSMC = new Consumer(toSourceMap);
    var resultMap = new Generator();
    fromSMC.eachMapping(function (mapping) {
        var generatedPosition = {
            line: mapping.generatedLine,
            column: mapping.generatedColumn
        };
        var fromOriginalPosition = {
            line: mapping.originalLine,
            column: mapping.originalColumn
        };
        // from's generated position -> to's original position
        var originalPosition = toSMC.originalPositionFor(fromOriginalPosition);
        if (originalPosition.source !== null) {
            resultMap.addMapping({
                source: originalPosition.source,
                name : originalPosition.name,
                generated: generatedPosition,
                original: originalPosition
            });
        }
    });
    if (toSMC.sources && toSMC.sourcesContent) {
        //resultMap.sourcesContent = toSMC.sourcesContent;
        toSMC.sourcesContent.forEach(function(sourceContent, index) {
            if (sourceContent && toSMC.sources[index]) {
                resultMap.setSourceContent(toSMC.sources[index], sourceContent);
            }
        });
    }
    return resultMap.toString();
}

module.exports = transfer;