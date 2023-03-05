var namespace = 'LikeButton';
// --------------------------------------------------------------------------------------------------------------------
exports = class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        liked: false
      };
    }

    render() {
      if (this.state.liked) {
        return 'You liked this! (' + this.props.commentID + ') ✔️';
      }

      return React.createElement(
        'button', {
          onClick: () => this.setState({
            liked: true
          })
        },
        'Like'
      );
    }
  };
//--------------------------------------------------------------------------------------------------------------------EOF