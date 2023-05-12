import {
  useState
} from 'react';

import {
  Image,
  View, StyleSheet
} from 'react-native';

export default function AsyncImage(props) {

  const [loaded, setLoaded] = useState(props.loaded);
  const placeholderSource = props.placeholderSource;
  const style = props.style;
  const source = props.source;

  const onLoadHandler = () => {
    setLoaded(true);
  }

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
        onLoad={onLoadHandler}
      />

      {!loaded &&
        <View style={styles.container}>
          <Image
            source={placeholderSource}
            resizeMode={'contain'}
            style={styles.image} />
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    verticalAlign: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4
  },
});


