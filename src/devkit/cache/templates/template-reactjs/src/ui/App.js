var namespace = 'App';
//----------------------------------------------------------------------------------------------------------------------
// https://reactjs.org/docs/add-react-to-a-website.html#add-react-in-one-minute
//----------------------------------------------------------------------------------------------------------------------
class Hello extends React.Component {
  render() {
    return React.createElement('h1', null, `Hello ${this.props.toWhat} ❤️!`);
  }
}
//----------------------------------------------------------------------------------------------------------------------
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
//----------------------------------------------------------------------------------------------------------------------
exports = App;
//--------------------------------------------------------------------------------------------------------------------EOF