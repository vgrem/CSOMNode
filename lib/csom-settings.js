var Settings = {
    
    minimizedScripts: false,
    
    scriptsFromLocal : true,

    modules : [
        {
            filename: 'initstrings.debug.js', 
            lcid: 1033
        },
        {
            filename: 'init.debug.js'
        },
        {
            filename: 'msajaxbundle.debug.js'
        },
        {
            filename: 'ext_msajax_patch.js',
            external: true 
        },
        {
            filename: 'sp.core.debug.js'
        },
        {
            filename: 'sp.runtime.DEBUG.js'
        },
        {
            filename: 'sp.DEBUG.js'
        }
    ]
}

exports.Settings = Settings;
