# React Native Picker
A dead simple, performant React Native Picker using Shopify's FlashList and React Native Reanimated

---

## Preview
As many items as you want | Supports disabled items
:-: | :-:
<video src='https://github.com/DaltonPelkey/react-native-picker/assets/9933256/1244d0af-9e8f-4e69-a0b6-327a9da8418f' width=180/> | <video src='https://github.com/DaltonPelkey/react-native-picker/assets/9933256/609b8576-43f5-4309-a4b9-d730ad031e16' width=180/>

---

## Installation
```
npm install @dpelkey98/react-native-picker
```
### Expo
The picker uses Reanimated under the hood. In order for it to work with Expo you need to install your specific SDK version
```
npx expo install react-native-reanimated
```
Refer to Reanimated's [getting started guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/#installation)

---

## Methods

| Method | Params | Description |
| --- | --- | --- |
| `.setValue()` | [Value](#Value) | Set the currently selected value of the picker |


---

## Props

| Prop | Value | Default | Description |
| ---- | ----- | ------- | ----------- |
| `data` | [PickerData](#PickerData) | `[]` | Data to render in your picker; `value ` must be unique |
| `defaultValue?` | [Value](#Value) | `undefined` | Automatically scrolls and selects the specified value |
| `disabled?` | `boolean` | `false` | Disable the picker |
| `onChange?` | `(PickerItem) => void` | `undefined` | Callback function passed with a [PickerItem](#PickerItem) |
| `itemHeight?` | `number` | `40` | Height of each item in the picker |
| `numberOfItems?` | `3 \| 5 \| 7` | `5` | Height of the picker; `numberOfItems*itemHeight` |
| `showsBar?` | `boolean` | `true` | Whether or not to display the center bar (grey bar in the videos above) |
| `barStyle?` | `ViewStyle` | `undefined` | Styles to apply to center bar |
| `barColor?` | `string` | `#efefef` | Convenience prop to only change the bar color |
| `itemTextStyle?` | `TextStyle` | `undefined` | Styles to apply to each picker item's text component |
| `itemDisabledTextStyle?` | `TextStyle` | `undefined` | Styles to apply to each disabled picker item's text component |
| `itemStyle?` | `Omit<ViewStyle, "height">` | `undefined` | Styles to apply to each picker item's container component |
| `itemDisabledStyle?` | `Omit<ViewStyle, "height">` | `undefined` | Styles to apply to each disabled picker item's container component |
| `style?` | `Omit<ViewStyle, "height">` | `undefined` | Styles to apply to the picker's container component |

---

## Types

### Value
```ts
string | number
```
### PickerItem
```ts
{
  label?: string;
  value: Value;
  disabled?: boolean;
}
```
### PickerData
Provided for convenience 
```ts
PickerItem[]
```
