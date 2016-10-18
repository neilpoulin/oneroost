if ( !version || isNaN(version) )
{
    print("no version specified, exiting")
    quit(0)
}

var scriptVersion = Number( version )

print("version = " + scriptVersion)
var cursor = db.Version.find({version: scriptVersion}, {version: 1, _id: 0});
if (cursor.hasNext() )
{
    print("version " + scriptVersion + " is already processed, skipping.");
    quit(1)
}
var result = db.Version.insert( { version: scriptVersion, descriptoin: "add unique index on vanity url v2" } )
if ( result.nInserted == 0 )
{
    print("not executing script as version has already run")
}




// if ( cursor.hasNext() )
// {
//     print("version already exists")
// }
// else{
//     print("updaing version");
// }

//
// db.Version.createIndex( { version: 1 }, { unique: true } )
//
// var myCursor = db.Version.find();
// myCursor.forEach(printjson);
//
//
