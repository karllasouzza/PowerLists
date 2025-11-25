import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Button, HelperText, IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface NewListItemProps {
  visible: boolean;
  onDismiss: () => void;
  theme: any;
  mode: 'add' | 'edit' | null;
  type: 'Lists' | 'Items';
  handleSubmit: () => void;
  onEdit: boolean;
  error: string;
  values: {
    title: string;
    price?: string;
    amount?: string;
  };
  setProduct: (value: string) => void;
  setPrice?: (value: string) => void;
  setAmount?: (value: string) => void;
  colors?: string[];
  colorSelected?: string;
  setColor?: (color: string) => void;
  icons?: string[];
  selectedIcon?: string;
  setIcon?: (icon: string) => void;
  blurBackground?: string;
  background?: string;
  labelBackground?: string;
  labelColor?: string;
  errorColor?: string;
  onSelectedColor?: string;
  selectedColor?: string;
}

export default function NewListItem({
  visible,
  onDismiss,
  theme,
  mode,
  type,
  handleSubmit,
  onEdit,
  error,
  values,
  setProduct,
  setPrice,
  setAmount,
  colors,
  colorSelected,
  setColor,
  icons,
  selectedIcon,
  setIcon,
  blurBackground,
  background,
  labelBackground,
  labelColor,
  errorColor,
  onSelectedColor,
  selectedColor,
}: NewListItemProps) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: background,
          padding: 20,
          margin: 20,
          borderRadius: 20,
          gap: 20,
        }}>
        <View className="w-full flex-row items-center justify-between">
          <Text
            variant="titleLarge"
            style={{ fontWeight: 'bold', color: theme.colors.onBackground }}>
            {mode === 'add'
              ? `Nova ${type === 'Lists' ? 'lista' : 'item'}`
              : `Editar ${type === 'Lists' ? 'lista' : 'item'}`}
          </Text>
          <IconButton icon="close" onPress={onDismiss} />
        </View>

        <View className="gap-4">
          <View>
            <TextInput
              mode="outlined"
              label={type === 'Lists' ? 'Nome da lista' : 'Nome do item'}
              value={values.title}
              onChangeText={setProduct}
              error={error === 'title'}
              style={{ backgroundColor: background }}
            />
            <HelperText type="error" visible={error === 'title'}>
              O nome deve ter pelo menos 3 caracteres
            </HelperText>
          </View>

          {type === 'Items' && setPrice && setAmount && (
            <View className="flex-row gap-4">
              <View className="flex-1">
                <TextInput
                  mode="outlined"
                  label="Preço"
                  value={values.price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  style={{ backgroundColor: background }}
                />
              </View>
              <View className="flex-1">
                <TextInput
                  mode="outlined"
                  label="Qtd"
                  value={values.amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  style={{ backgroundColor: background }}
                />
              </View>
            </View>
          )}

          {type === 'Lists' && colors && setColor && (
            <View>
              <Text variant="titleMedium" style={{ marginBottom: 10 }}>
                Cor
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-4 p-1">
                  {colors.map((color) => (
                    <Pressable
                      key={color}
                      onPress={() => setColor(color)}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: theme.colors[color],
                        borderWidth: colorSelected === color ? 2 : 0,
                        borderColor: theme.colors.onBackground,
                      }}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {type === 'Lists' && icons && setIcon && (
            <View>
              <Text variant="titleMedium" style={{ marginBottom: 10 }}>
                Ícone
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-4 p-1">
                  {icons.map((iconName) => (
                    <Pressable
                      key={iconName}
                      onPress={() => setIcon(iconName)}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor:
                          selectedIcon === iconName ? theme.colors.primaryContainer : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <MaterialCommunityIcons
                        name={iconName as any}
                        size={24}
                        color={theme.colors.onBackground}
                      />
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>

        <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 10 }}>
          {mode === 'add' ? 'Criar' : 'Salvar'}
        </Button>
      </Modal>
    </Portal>
  );
}
