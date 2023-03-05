# Template > ReactJs

This template demonstrates and sets up a simple HTML page using [React](https://reactjs.org).
It implements a basic demo of React without JSX as found int the official document [Add React in One Minute](https://reactjs.org/docs/add-react-to-a-website.html#add-react-in-one-minute).

Because WebNatives only runs on the browser without compilation, there is no implemented support for JSX. To know more about this go to [React Without JSX](https://reactjs.org/docs/react-without-jsx.html) to learn more.

#### External dependencies.
- Scripts
> https://unpkg.com/react@18/umd/react.production.min.js
> https://unpkg.com/react-dom@18/umd/react-dom.production.min.js

#### Folder structure
- 📁/root
    - 📁/logic *all your app logic should be here*
    - 📁/ui *all your user interface logic should be here*
        - 📁/schemas *auto generated JSON schemas from the [WYSIWYG Editor](#wysiwyg)*
        -  📁/components *all your components should be here*
            - 🗎 LikeButton.js
        - 🗎 Bootstrap.js
        - 🗎 App.js *__entry file__*
    - 📁/workers *__advanced__: place and register your service workers here*

### To start just modify the src/ui/App.js file.
```
class App {
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
  
  constructor(){
    // add loading your dependencies here for better Live Editing support. This won't impact production.
    jsio('import src.ui.components.LikeButton as LikeButton');
  }
  
  start() {
    document.body.innerHTML = '';
    this.renderLayout(document.body, [
      {
        children: [],
        type: 'div',
        id: "title",
      },
      {
        children: [],
        type: 'div',
        id: "like_button_container",
        className: 'like_button_container'
      }
    ]);

    // Find all DOM containers, and render Like buttons into them.
    document.querySelectorAll('.like_button_container')
      .forEach(domContainer => {
        // Read the comment ID from a data-* attribute.
        const commentID = 1234;
        const root = ReactDOM.createRoot(domContainer);
        root.render(
          React.createElement(LikeButton, {
            commentID: commentID
          })
        );
      });
      
      ReactDOM.createRoot(document.getElementById('title')).render(React.createElement(Hello, {toWhat: 'React'}, null));  
  }
}
exports = App;
```
This template also has a setup to help render your page layout via JSON structure as you can find in detail in the [Bootstrap Template documentation](#bootstrap).

#### Find the live demo [here](https://webnatives.app/templates).

---------------------------
© 2023 WebNatives
