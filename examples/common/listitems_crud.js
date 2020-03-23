const {executeQuery, getAuthenticatedContext} = require('./extensions');
const settings = require('../settings.js').settings;

function logError(sender,args) {
    console.log('An error occured: ' + args.get_message());
}



async function readListItems(web, listTitle) {
    const ctx = web.get_context();
    const list = web.get_lists().getByTitle(listTitle);
    const items = list.getItems(SP.CamlQuery.createAllItemsQuery());
    ctx.load(items);
    await executeQuery(ctx);
    return items;
}

async function createListItem(web, listTitle) {
    const ctx = web.get_context();
    const list = web.get_lists().getByTitle(listTitle);
    const creationInfo = new SP.ListItemCreationInformation();
    const listItem = list.addItem(creationInfo);
    listItem.set_item('Title', 'New Task');
    listItem.update();
    ctx.load(listItem);
    await executeQuery(ctx);
    return listItem;
}


async function updateListItem(listItem) {
    const ctx = listItem.get_context();
    listItem.set_item('Title', 'New Task (updated)');
    listItem.update();
    ctx.load(listItem);
    await  executeQuery(ctx);
    return listItem;
}

async function deleteListItem(listItem, success, error) {
    const ctx = listItem.get_context();
    listItem.deleteObject();
    await  executeQuery(ctx);
}


(async () => {

    const ctx = await getAuthenticatedContext(settings.siteUrl,settings.username, settings.password);
    const web = ctx.get_web();

    console.log("1. Create list item");
    const targetItem = await createListItem(web, "Tasks")
    console.log(String.format('Task {0} has been created successfully', targetItem.get_item('Title')));

    console.log("2. Read list items");
    const items = await readListItems(web, "Tasks");
    items.get_data().forEach(function(item) {
        console.log(item.get_fieldValues().Title);
    });

    console.log("3. Update list item");
    await updateListItem(targetItem);
    console.log(String.format('Task {0} has been updated successfully', targetItem.get_item('Title')));

    console.log("4. Delete list item");
    await deleteListItem(targetItem);
    console.log('Task has been deleted successfully');

})().catch(logError);
