import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import {
  IconHome,
  IconUser,
  IconPlus,
  IconPencil,
  IconArrowLeft,
} from '@tabler/icons-react-native';

interface FooterProps {
  background?: string;
  iconColor?: string;
  onIconColor?: string;
  onIconBackground?: string;
  returnColor?: string;
  returnBackground?: string;
  mode?: 'default' | 'add' | 'edit' | 'account' | 'listItem';
  route?: string;
  homeHandle?: () => void;
  accountHandle?: () => void;
  addHandle?: () => void;
  addNewItem?: () => void;
  editItems?: () => void;
  returnOfMode?: () => void;
}

const Footer = ({
  background = '#fff',
  iconColor = '#000',
  onIconColor = '#000',
  onIconBackground = '#eee',
  returnColor = '#000',
  returnBackground = '#eee',
  mode = 'default',
  route,
  homeHandle,
  accountHandle,
  addHandle,
  addNewItem,
  editItems,
  returnOfMode,
}: FooterProps) => {
  const DefaultFooter = () => (
    <View
      className="flex-row items-center justify-between px-6 pb-2 pt-2"
      style={{ backgroundColor: background }}>
      {/* Home Button */}
      <Pressable
        onPress={homeHandle}
        className="h-[55px] w-[100px] items-center justify-center rounded-[50px]"
        style={{
          backgroundColor: route === 'Home' ? onIconBackground : background,
        }}>
        <Icon as={IconHome} size={24} color={route === 'Home' ? onIconColor : iconColor} />
        <Text
          className="text-center text-xs font-bold"
          style={{ color: route === 'Home' ? onIconColor : iconColor }}>
          Inicio
        </Text>
      </Pressable>

      {/* Add/Edit Button (Center) */}
      <Pressable
        onPress={addHandle}
        className="absolute -top-8 left-[50%] h-[70px] w-[70px] -translate-x-[35px] items-center justify-center rounded-full border-2"
        style={{
          backgroundColor: background,
          borderColor: onIconBackground,
        }}>
        <Icon
          as={mode === 'account' ? IconPencil : IconPlus}
          size={35}
          color={onIconBackground}
          fill={onIconBackground} // Some icons might need fill, but Tabler usually uses stroke/color
          className="text-primary" // Fallback
          style={{ color: onIconBackground }}
        />
      </Pressable>

      {/* Account Button */}
      <Pressable
        onPress={accountHandle}
        className="h-[55px] w-[100px] items-center justify-center rounded-[50px]"
        style={{
          backgroundColor: route === 'Account' ? onIconBackground : background,
        }}>
        <Icon as={IconUser} size={24} color={route === 'Account' ? onIconColor : iconColor} />
        <Text
          className="text-center text-xs font-bold"
          style={{ color: route === 'Account' ? onIconColor : iconColor }}>
          Conta
        </Text>
      </Pressable>
    </View>
  );

  const ActionFooter = () => (
    <View
      className="flex-row items-center justify-between px-6 pb-2 pt-2"
      style={{ backgroundColor: background }}>
      <Button
        className="mr-4 flex-1"
        style={{ backgroundColor: onIconBackground }}
        onPress={mode === 'add' ? addNewItem : editItems}>
        <Text style={{ color: onIconColor }} className="font-bold">
          {mode === 'add' ? 'Adicionar' : 'Editar'}
        </Text>
      </Button>

      <Pressable
        onPress={returnOfMode}
        className="h-[55px] w-[100px] items-center justify-center rounded-[50px]"
        style={{ backgroundColor: returnBackground }}>
        <Icon as={IconArrowLeft} size={24} color={returnColor} />
        <Text className="text-center text-xs font-bold" style={{ color: returnColor }}>
          Voltar
        </Text>
      </Pressable>
    </View>
  );

  const DefaultListItemFooter = () => (
    <View
      className="flex-row items-center justify-between px-6 pb-2 pt-2"
      style={{ backgroundColor: background }}>
      {/* Return Button */}
      <Pressable
        onPress={homeHandle}
        className="h-[55px] w-[100px] items-center justify-center rounded-[50px]"
        style={{
          backgroundColor: route === 'Home' ? onIconBackground : background,
        }}>
        <Icon as={IconArrowLeft} size={24} color={route === 'Home' ? onIconColor : iconColor} />
        <Text
          className="text-center text-xs font-bold"
          style={{ color: route === 'Home' ? onIconColor : iconColor }}>
          Voltar
        </Text>
      </Pressable>

      {/* Add Button (Center) */}
      <Pressable
        onPress={addHandle}
        className="absolute -top-8 left-[50%] h-[70px] w-[70px] -translate-x-[35px] items-center justify-center rounded-full border-2"
        style={{
          backgroundColor: background,
          borderColor: onIconBackground,
        }}>
        <Icon
          as={IconPlus}
          size={35}
          color={onIconBackground}
          style={{ color: onIconBackground }}
        />
      </Pressable>

      {/* Account Button */}
      <Pressable
        onPress={accountHandle}
        className="h-[55px] w-[100px] items-center justify-center rounded-[50px]"
        style={{
          backgroundColor: route === 'Account' ? onIconBackground : background,
        }}>
        <Icon as={IconUser} size={24} color={route === 'Account' ? onIconColor : iconColor} />
        <Text
          className="text-center text-xs font-bold"
          style={{ color: route === 'Account' ? onIconColor : iconColor }}>
          Conta
        </Text>
      </Pressable>
    </View>
  );

  switch (mode) {
    case 'add':
    case 'edit':
      return <ActionFooter />;
    case 'listItem':
      return <DefaultListItemFooter />;
    default:
      return <DefaultFooter />;
  }
};

export default Footer;
