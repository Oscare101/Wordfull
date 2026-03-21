import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ThemeType } from '../../constants/themes/themeType';
import { Language } from '../../constants/interfaces/interface';
import colors from '../../constants/themes/colors';
import ButtonBlock from '../global/ButtonBlock';

export default function UserDataActionModal({
  visible,
  title,
  description,
  confirmTitle,
  cancelTitle,
  onClose,
  onConfirm,
  theme,
  language,
  children,
  password,
  setPassword,
  showPasswordInput = false,
  confirmDisabled = false,
  loading = false,
}: {
  visible: boolean;
  title: string;
  description: string;
  confirmTitle: string;
  cancelTitle: string;
  onClose: () => void;
  onConfirm: () => void;
  theme: ThemeType;
  language: Language;
  children?: React.ReactNode;
  password?: string;
  setPassword?: (value: string) => void;
  showPasswordInput?: boolean;
  confirmDisabled?: boolean;
  loading?: boolean;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar
        backgroundColor={colors[theme].bgDim}
        barStyle={colors[theme].barStyle}
      />
      <View
        style={[styles.overlay, { backgroundColor: colors[theme].bgShadow }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={[styles.modal, { backgroundColor: colors[theme].bg }]}>
          <Text style={[styles.title, { color: colors[theme].main }]}>
            {title}
          </Text>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={[styles.description, { color: colors[theme].comment }]}
            >
              {description}
            </Text>

            {children}

            {showPasswordInput && setPassword ? (
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Backup password"
                placeholderTextColor={colors[theme].comment}
                secureTextEntry
                style={[
                  styles.input,
                  {
                    color: colors[theme].main,
                    borderColor: colors[theme].border,
                  },
                ]}
              />
            ) : null}
          </ScrollView>

          <View style={styles.row}>
            <ButtonBlock
              title={cancelTitle}
              action={onClose}
              theme={theme}
              styles={styles.button}
              titleStyles={{ fontSize: 18 }}
            />
            <ButtonBlock
              title={loading ? '...' : confirmTitle}
              action={onConfirm}
              theme={theme}
              styles={styles.button}
              titleStyles={{ fontSize: 18 }}
              disabled={confirmDisabled || loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '92%',
    maxHeight: '75%',
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 22,
  },
  description: {
    fontSize: 14,
  },
  scroll: {
    width: '100%',
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 4,
  },
  input: {
    width: '100%',
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 0,
  },
});
