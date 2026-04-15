import { Colors, Typography, ThemeManager } from 'react-native-ui-lib';

Colors.loadColors({
    logoColor: '#d20000'
});

Typography.loadTypographies({
    h1: { fontSize: 58, fontWeight: '300', lineHeight: 80 },
    h2: { fontSize: 46, fontWeight: '300', lineHeight: 64 },
});

ThemeManager.setComponentForcedTheme('TextField', () => {
    return {
        // this will apply a different backgroundColor
        // depending on whether the Button has an outline or not
        backgroundColor: 'pink',
        backgroundColor: 'grey',
        borderWidth: 5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    };
});