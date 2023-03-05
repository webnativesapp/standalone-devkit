# Template > Bootstrap<img src="https://webnatives.oneflagstudio.com/assets/images/logo.png" width="42" align="right"/>
This template demonstrates and sets up a simple HTML page using [Bootstrap](https://getbootstrap.com/) to get a quick up and running responsive layout.

#### External dependencies.
- Scripts
> https://code.jquery.com/jquery-3.2.1.slim.min.js
> https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js

- Cascading Style Sheets
> https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css
> https://getbootstrap.com/docs/4.0/assets/css/docs.min.css


#### Folder structure
- 📁/root
    - 📁/logic *all your app logic should be here*
    - 📁/ui *all your user interface logic should be here*
        - 📁/schemas *auto generated JSON schemas from the [WYSIWYG Editor](/docs/guides_wysiwyg)*
        -  📁/components *all your components should be here*
        - 🗎 Bootstrap.js
        - 🗎 App.js *__entry file__*
    - 📁/workers *__advanced__: place and register your service workers here*

### To start just modify the src/ui/App.js file.
It provides some setup to help render your page layout via JSON structure. Example:
```
renderLayout(parentElement, layout) {
   for (var i = 0; i < layout.length; i++) {
     var element = document.createElement(layout[i].type || 'div');
     element.style['background-color'] = layout[i].color;
     element.className = layout[i].className || '';
     element.id = layout[i].id;
     if (layout[i].children) {
       this.renderLayout(element, layout[i].children);
     }
     parentElement.appendChild(element);
  }
}

start(){
	...
	this.renderLayout(document.body, [{
      children: [],
      id: "header",
    }, {
      id: "main",
      className: "row",
      children: [
      { 
        className: "col-12 col-md-8 col-xl-8",
        children: [],
        id: "content-wide"
      },
      {
        className: "col-12 col-md-4 col-xl-4 py-md-3 pl-md-5 bd-sidebar",
        children: [],
        id: "menu"
      }, { 
        className: "col-12 col-md-8 col-xl-8",
        children: [],
        id: "content-small"
      }]
    }]);
}
...

```
Outputs:
```
<body>
	<div class="" id="header"></div>
	<div class="row" id="main">
		<div class="col-12 col-md-8 col-xl-8" id="content-wide"></div>
		<div class="col-12 col-md-4 col-xl-4 py-md-3 pl-md-5 bd-sidebar" id="menu"></div>
		<div class="col-12 col-md-8 col-xl-8" id="content-small"></div>
	</div>
</body>
```


---------------------------
 © 2023 WebNatives
