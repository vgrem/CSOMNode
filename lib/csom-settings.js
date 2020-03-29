var Settings = {

    version: "16.0.19918.12024",
    
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
                filename: 'sp.runtime.debug.js'
            },
            {
                filename: 'sp.DEBUG.js'
            },
            {
                filename: 'sp.extensions.js',
                external: true
            }
        ],
        'taxonomy' : [
            {
                name: 'taxonomy',
                filename: 'sp.taxonomy.debug.js'
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

   
};

exports.Settings = Settings;
