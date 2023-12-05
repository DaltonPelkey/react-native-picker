import {FC, memo} from 'react'
import Animated, {
	useAnimatedStyle,
	FadeIn,
	FadeOut,
	SharedValue,
	interpolate, useDerivedValue
} from 'react-native-reanimated'
import {Pressable, StyleSheet, Text, TextStyle, ViewStyle} from 'react-native'
import {PickerItem} from './Picker'

type ListItemProps = {
	item: PickerItem;
	itemHeight: number;
	handlePress: () => void;
	index: number;
	offset: SharedValue<number>;
	numItems: number;
	itemTextStyle?: TextStyle;
	itemDisabledTextStyle?: TextStyle;
	itemStyle?: ViewStyle;
	itemDisabledStyle?: ViewStyle;
}

const ListItem:FC<ListItemProps> = memo(
	({
		item,
		itemHeight,
		handlePress,
		index,
		offset,
		numItems,
		itemTextStyle,
		itemDisabledTextStyle,
		itemStyle,
		itemDisabledStyle
	}) => {
		const relativeOffset = useDerivedValue(() => {
			return index - (offset.value/itemHeight)
		})

		const animatedStyles = useAnimatedStyle(() => {
			return {
				transform: [
					{
						rotateX: interpolate(
							relativeOffset.value,
							(() => {
								const range = [0]
								for (let i = 1; i <= numItems; i++) {
									range.unshift(-i)
									range.push(i)
								}
								return range
							})(),
							(() => {
								const range = [1]
								for (let x = 1; x <= numItems; x++) {
									const y = x*25
									range.unshift(y)
									range.push(y)
								}
								return range
							})()
						).toString() + 'deg'
					},
					{
						scale: interpolate(
							relativeOffset.value,
							(() => {
								const range = [0]
								for (let i = 1; i <= numItems; i++) {
									range.unshift(-i)
									range.push(i)
								}
								return range
							})(),
							(() => {
								const range = [1.0];
								for (let x = 1; x <= numItems; x++) {
									const y = 0.95 ** x
									range.unshift(y)
									range.push(y)
								}
								return range
							})()
						)
					}
				]
			}
		}, [])

		return (
			<Pressable onPress={handlePress}>
				<Animated.View
					style={[
						s.defaultItemStyle,
						{
							height: itemHeight
						},
						animatedStyles,
						itemStyle,
						item.disabled && itemDisabledStyle
					]}
					entering={FadeIn}
					exiting={FadeOut}
				>
					<Text
						style={[
							s.defaultTextStyle,
							itemTextStyle,
							item.disabled && {
								textDecorationLine: 'line-through',
								...itemDisabledTextStyle
							}
						]}
						numberOfLines={1}
						ellipsizeMode={'tail'}
					>{item.label || item.value}</Text>
				</Animated.View>
			</Pressable>
		)
	}
)

const s = StyleSheet.create({
	defaultItemStyle: {
		width: '100%',
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center'
	},
	defaultTextStyle: {
		textAlign: 'center'
	}
})

export { ListItem }