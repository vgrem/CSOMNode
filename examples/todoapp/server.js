var bodyParser = require('body-parser');
var express = require('express');
var todomvc = require('todomvc');
var todos = require('./todos.js');
var sharepoint = require('./sharepoint.js');



var app = module.exports.app = express();
var api = module.exports.api = express();
api.use(bodyParser.json());
app.use('/api', [api]);

//app.use(function(callback) {
//    callback(null /* error */, result);
//});
//app.use(sharepoint.authenticate);

// Declare the root route *before* inserting TodoMVC as middleware to prevent
// the TodoMVC app from overriding it.
app.get('/', function (req, res) {
    res.redirect('/examples/angularjs');
});
app.use(todomvc);



// API Routes.
api.get('/', function(req, res, next) {
    sharepoint.authenticate(function (err, authCtx) {
        todos.authenticate(authCtx);
        res.status(200)
            .set('Content-Type', 'text/plain')
            .send('');
    });
});

api.get('/todos', function (req, res) {
    todos.getAll(_handleApiResponse(res));
});

api.get('/todos/:id', function (req, res) {
    todos.get(req.param('id'), _handleApiResponse(res));
});

api.post('/todos', function (req, res) {
    todos.insert(req.body, _handleApiResponse(res, 201));
});

api.put('/todos/:id', function (req, res) {
    todos.update(req.param('id'), req.body, _handleApiResponse(res));
});

api.delete('/todos', function (req, res) {
    todos.deleteCompleted(_handleApiResponse(res, 204));
});

api.delete('/todos/:id', function (req, res) {
    todos.delete(req.param('id'), _handleApiResponse(res, 204));
});

function _handleApiResponse(res, successStatus) {
    return function (err, payload) {
        if (err) {
            console.error(err);
            res.status(err.code).send(err.message);
            return;
        }
        if (successStatus) {
            res.status(successStatus);
        }
        res.json(payload);
    };
}


// Configure the sidebar to display relevant links for our hosted version of TodoMVC.
todomvc.learnJson = {
    name: 'TodoMVC backend using csom-node.',
    description: 'TodoMVC backend that demonstrates how to store data in SharePoint Online',
    homepage: 'http://cloud.google.com/solutions/nodejs',
    examples: [
        {
            name: 'csom-node TodoMVC example',
            url: 'https://github.com/vgrem/CSOMNode/tree/master/examples/todo'
        }
    ],
    link_groups: [
        {
            heading: 'Official Resources',
            links: [
                {
                    name: 'csom-node',
                    url: 'https://github.com/vgrem/CSOMNode'
                }
            ]
        }
    ]
};


app.listen(3000);