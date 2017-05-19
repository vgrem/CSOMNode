var Settings = {
    
    minimizedScripts: false,
    
    scriptsFromLocal : true,
    
    packages : {
        'core' : [
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
        ],
        'taxonomy' : [
            {
                name: 'taxonomy',
                filename: 'sp.taxonomy.DEBUG.js'
            }
        ],
        'userprofile' : [
            {
                name: 'userprofile',
                filename: 'sp.userprofiles.debug.js'
            }
        ],
        'publishing' : [
            {
                name: 'publishing',
                filename: 'sp.publishing.debug.js'
            }
        ],
        'policy' : [
            {
                name: 'policy',
                filename: 'sp.policy.debug.js'
            }
        ]
    }

   
}

exports.Settings = Settings;
