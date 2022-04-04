class HelloMessage extends React.Component {
  render() {
    return <div>Hola {this.props.name}</div>;
  }
}

root.render(<HelloMessage name="Taylor" />);
