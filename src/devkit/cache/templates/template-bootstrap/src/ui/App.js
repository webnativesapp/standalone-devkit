var namespace = 'App';
//----------------------------------------------------------------------------------------------------------------------
const STATE = {
  SELECTED: 'active',
  UNSELECTED: 'inactive'
};
//----------------------------------------------------------------------------------------------------------------------
class App {
  
  setInternalCss() {
    var style = document.getElementsByTagName('style')[0] || document.createElement('style');
    style.innerText = `
      .inactive{
        font-weight: 100 !important;
      }
      
      .active-content {
        margin-top: 14px;  
        //border: 1px solid #ddd;
        //border-radius: 3px;
        background: white;
      }
      
      .menu-list{
        margin-left: 21px
      }
      .separator{
        background: #cbcbcb;
        width: 80%;
        height: 1px;
        padding: 0px;
        margin: 0px 21px;
        display: block;
      }
      
    `.replace(/\n/gm, "").trim(); 
    if (document.getElementsByTagName('style')[0] === null) {
      document.head.appendChild(style)
    }
  }

  setBaseStyle() {
    const bgColor = '#fff'
    document.documentElement.style.setProperty('background-color', bgColor);
    document.body.innerHTML = "";
    document.body.style = `overflow: auto;`
    document.body.style.setProperty('background-color', bgColor);
  }

  constructor() {
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      items: [],
      activeContent: `Nope` 
    };
    
    this.state.items = [{
    "title": "Hello World",
    "slug": "#",
    "content": `<h1>Hello Bootstrap!</h1><p>Fully responsive layout made simple!</p>`
  },{
    "title": "Hello WebNatives",
    "slug": "#wb", 
    "content": `<h3>Hello WebNatives!</h3><p>Fully responsive layout made simple!</p>`
  }];
    this.state.slugMap = new Map();
    this.state.items.forEach((post)=>{
      this.state.slugMap.set(post.slug, post.content);
      post.state = STATE.UNSELECTED;
    });
    
    this.registerPopStateHandler();
    this.registerResizeHandler();
 
    this.setBaseStyle();
    this.setInternalCss();
  }
  
  start(){
    
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
    
    this.renderHeader('Bootstrap Demo');
    
    this.renderList();
    
    this.renderBody();
    
    this.onResize();
  }

  registerPopStateHandler() {
    // register resize handler
    if (window.onPopStateFunction) {
      window.removeEventListener('popstate', window.onPopStateFunction);
    }
    window.onPopStateFunction = this.onPopStateChanged.bind(this);
    // Watch for browser/canvas resize events
    window.addEventListener("popstate", window.onPopStateFunction);
  }

  onPopStateChanged(event) {
    this.renderBody();
  }

  registerResizeHandler() {
    // register resize handler
    if (window.onResizeFunction) {
      window.removeEventListener('resize', window.onResizeFunction);
    }
    window.onResizeFunction = this.onResize.bind(this);
    // Watch for browser/canvas resize events
    window.addEventListener("resize", window.onResizeFunction);
  }

  onResize(event) {
    this.state.width = window.innerWidth;
    this.state.height =window.innerHeight;
    document.getElementById('main').style.setProperty('padding-top', (this.state.width < 768) ? '7.75rem' : '6rem');
    document.getElementById('main').style.setProperty('max-width', (this.state.width < 1024) ? '97%' : '80%');
    document.getElementById('main').style.setProperty('margin', '0px auto');
    
    const contentElementId = this.getActiveRenderElementId();
    if(contentElementId === 'content-wide'){
      document.getElementById('content-wide').innerHTML = this.state.activeContent;
      document.getElementById('content-small').innerHTML = '';
      document.getElementById('content-wide').classList.add('active-content');
      document.getElementById('content-small').classList.remove('active-content');
    }else{
      document.getElementById('content-small').innerHTML = this.state.activeContent;
      document.getElementById('content-wide').innerHTML = '';
      document.getElementById('content-small').classList.add('active-content');
      document.getElementById('content-wide').classList.remove('active-content');
    }
  }
  
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

  renderHeader(title) {
    document.getElementById('header').style = `margin: 0px; padding: 0px; position: fixed; width: 100%; z-index: 999;`
    document.getElementById('header').innerHTML = `
      <header class="navbar navbar-expand navbar-dark flex-column flex-md-row bd-navbar" style="background-color: black;">
        <a class="navbar-brand mr-0 mr-md-2" href="/" aria-label="Hello World">
          <img style="max-width: inherit;" width="30px" height="30px" src="https://webnatives.oneflagstudio.com/assets/images/logo.png" align="right" />
        </a>
        <div class="navbar-nav-scroll">
          <ul class="navbar-nav bd-navbar-nav flex-row">
            <li class="nav-item">
              <a class="nav-link active" href="#">${title}</a>
            </li>
          </ul>
        </div>

        <ul class="navbar-nav flex-row ml-md-auto d-none d-md-flex">
            <li class="nav-item">
              <a class="nav-link " href="#action1" target="_blank">Action 1</a>
            </li>
            <li class="nav-item">
              <a class="nav-link " href="#action2" target="_blank">Action 2</a>
            </li>
        </ul>
    </header>
    `;
  }

  renderList() {
    document.getElementById('menu').style.setProperty('border', 'none');
    document.getElementById('menu').innerHTML = `
    <button class="btn btn-link bd-search-docs-toggle d-md-none p-0 ml-3"
            style="z-index: 9999;
                   position: absolute;
                   top: -14px;
                   color: black;
                   right: 1.5rem;"
            type="button" data-toggle="collapse" 
            data-target="#bd-docs-nav" aria-controls="bd-docs-nav" aria-expanded="true" 
            aria-label="Toggle docs navigation">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30" height="30" focusable="false"><title>Menu</title><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" d="M4 7h22M4 15h22M4 23h22"></path></svg>
      </button>
    
    <nav class="collapse bd-links" 
         id="bd-docs-nav" 
         style="background: #f5f5f5; border: none; margin-top: 21px">
         <h4 class="menu-list">MENU</h4>
         <div class="separator"></div>
      ${this.renderMenu()}
    </nav>
    `;
  }

  renderMenu() {
    const items = this.state.items;

    let listRenderTemplate = [];
    for (let i in items) {
      listRenderTemplate.push(`
      <div class="bd-toc-item ${items[i].state}"> 
        <a class="bd-toc-link ${items[i].state}" href=${items[i].slug}>
          ${items[i].title}
        </a>
      </div>
    `);
    }

    return listRenderTemplate.join('');
  }
  
  getActiveRenderElementId(){
    return (this.state.width < 768) ? 'content-small' : 'content-wide';
  }
  
  renderBody() {
    window.scrollTo(0, 0);
    const hash = (location.hash || '#').toLowerCase();
    
    const item = this.state.items.filter((item)=>{
      return item.slug == hash;
    })[0] || this.state.items[0];
    this.state.items.forEach((item)=>{
      item.state = STATE.UNSELECTED
    });
    
    this.state.activeContent = this.state.slugMap.get(hash);
    document.getElementById(this.getActiveRenderElementId()).innerHTML = this.state.activeContent;
    
    item != void 0 && (item.state = STATE.SELECTED);
    
    this.renderList();
  };
}
//----------------------------------------------------------------------------------------------------------------------
exports = App;
//--------------------------------------------------------------------------------------------------------------------EOF