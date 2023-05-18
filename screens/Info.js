import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

function Help() {
    return (
        <View style={styles.container}>
            <Text style={styles.textTitle}>Moj Pvác - Ledinska imena</Text>
            <Text style={styles.text}>Ledinska imena so del jezikovno-kulturnega izročila prostora, v katerem ljudje živijo in delajo. Izvirajo iz naravnih danosti ali človekove dejavnosti v prostoru, ljudem pa služijo za orientacijo v domačem delovnem okolju.</Text>
            <Text style={styles.text}>Ledinska imena so v Sloveniji zelo razširjena, saj je bila tudi narečna raznolikost zelo velika. Vsa ta raznolikost se odraža tudi v poimenovanju krajev.</Text>
            <Text style={styles.text}>Podatke o ledinskih imenih, ki ji uporabja tudi 'Moj Pvác', lahko najdete na spletni strani http://www.ledinskaimena.si/, izdano so pod licenco:</Text>
            <Text style={styles.textLicense}>CC-BY-4.0: Flu-Led – ledinskaimena.si</Text>
            <Text style={styles.text}>Podatki v Sloveniji so za občine na severozahodu na Gorenjskem in sicer za naslednje občine: Bohinj, Bovec, Gorje, Jesenice, Jezersko, Kranj, Kranjska gora, Radovljica, Tržič in Žirovnica.</Text>
            <Text style={styles.text}>Podatki v Avstriji so za občine na jugu Koroške in sicer za naslednje občine: Bekštanj/Finkenstein, Beljak/Villach, Bilčovs/Ludmannsdorf, Bistrica v R./Feistritz i.R., Borovlje/Ferlach, Celovec/Klagenfurt, Galicija/Gallizien, Grabštanj/Grafenstein, Hodiše ob jezeru/Keutschach, Kotmara vas/Köttmannsdorf, Podkloster/Arnoldstein, Rožek/Rosegg, Sele/Zell, Šentjakob v R./ St. Jakob i..R., Škofiče/Schiefling, Šmarjeta v R./ St. Margareten i.R., Vrba/Velden, Železna Kapla/Bad Eisenkappel, Žihpolje/Maria Rain in Žrelec/Ebenthal.</Text>
        </View>
    );
}

export default Help;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        margin: 12,
        verticalAlign: 'center',
    },
    textTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary50,
        textAlign: 'left',
        marginBottom: 20,
    },
    text: {
        fontSize: 14,
        color: Colors.primary50,
        textAlign: 'left',
        marginBottom: 12,
    },
    textLicense: {
        fontSize: 14,
        color: Colors.primary50,
        textAlign: 'left',
        marginBottom: 12,
        fontStyle: 'italic',
    },
}
);