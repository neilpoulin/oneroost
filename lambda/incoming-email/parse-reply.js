exports.parseReply = function( rawText )
{
    return parseText( rawText);
}

function parseText( rawText ){
    var lines = rawText.split( /\r?\n/ );
    var linesToKeep = [];
    var foundReply = false;
    for ( var i = 0; i < lines.length; i++ ){
        var line = lines[i];
        if ( line.trim().indexOf(">") == 0 ){
            foundReply = true;
            console.log("found reply:", line);
            break;
        }
        else {
            linesToKeep.push( line )
            console.log("adding line:", line);
        }
    }

    if ( foundReply ){
        linesToKeep.pop();
        linesToKeep.pop();
        linesToKeep.pop();
    }
    return linesToKeep.join("\n");
}
