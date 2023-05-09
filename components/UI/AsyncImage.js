import React, {
  Component
} from 'react';

import {
  Image,
  View
} from 'react-native';

export default class AsyncImage extends Component {

  constructor(props) {
    super(props)
    this.state = { loaded: false }
  }

  render() {
    const {
      placeholderSource,
      style,
      source
    } = this.props

    return (
      <View
        style={style}>

        <Image
          source={source}
          resizeMode={'contain'}
          style={[
            style,
            {
              position: 'absolute',
              resizeMode: 'contain'
            }
          ]}
          onLoad={this._onLoad} />

        {!this.state.loaded &&
          <Image
            source={placeholderSource}
            style={[
              {
                position: 'relative',
              }
            ]} />
        }
      </View>
    )
  }

  _onLoad = () => {
    this.setState(() => ({ loaded: true }))
  }
}