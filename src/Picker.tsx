import {StyleSheet, TextStyle, View, ViewStyle} from 'react-native'
import {
	forwardRef,
	memo,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useState
} from 'react'
import {ListItem} from './ListItem'
import {FlashList} from '@shopify/flash-list'
import {useSelectedItem} from './useSelectedItem'

type Value = string | number;

export type PickerItem = {
	label?: string;
	value: Value;
	disabled?: boolean;
}

export type PickerData = PickerItem[];

export type PickerProps = {
	data: PickerItem[];
	defaultValue?: Value;
	disabled?: boolean;
	onChange?: (item:PickerItem) => void;
	itemHeight?: number;
	numberOfItems?: 3 | 5 | 7;
	showsBar?: boolean;
	barStyle?: ViewStyle;
	barColor?: string;
	itemTextStyle?: TextStyle;
	itemDisabledTextStyle?: TextStyle;
	itemStyle?: ViewStyle;
	itemDisabledStyle?: ViewStyle;
	style?: Omit<ViewStyle, 'height'>
}

type PickerMethods = {
	setValue: (value:Value) => void;
}

type Picker = PickerMethods;

const PickerComponent = forwardRef<Picker, PickerProps>(
	function Picker(
		{
			data: defaultData,
			defaultValue,
			disabled,
			onChange,
			itemHeight = 40,
			numberOfItems,
			showsBar = true,
			barColor,
			barStyle,
			itemStyle,
			itemTextStyle,
			itemDisabledStyle,
			itemDisabledTextStyle,
			style
		},
		ref
	) {

		const NUMBER_OF_ITEMS = useMemo(() => numberOfItems || 5, [numberOfItems])
		const BLANK_ITEM_OFFSET = useMemo(() => Math.round((NUMBER_OF_ITEMS-1)/2), [NUMBER_OF_ITEMS])

		const [data] = useState<PickerData>(defaultData)

		const findNextAvailableIndex = useCallback((baseIndex:number) => {
			for (let i = baseIndex; i < data.length; i++) {
				if (!data[i].disabled) return i
			}
			for (let i = baseIndex; i > 0; i--) {
				if (!data[i].disabled) return i
			}
			return baseIndex
		}, [data])

		const defaultValueIndex = useMemo(() => {
			if (defaultValue) {
				let index = data.findIndex(i => i.value === defaultValue)
				if (index > -1) {
					if (data[index].disabled) {
						index = findNextAvailableIndex(index)
					}
					return index
				}
			}
			return 0
		}, [])
		const [value, setValue] = useState<PickerItem>(data[defaultValueIndex])

		const {
			handleScroll,
			scrollRef,
			selectedIndex,
			offset
		} = useSelectedItem(itemHeight, data.length)

		const scrollTo = useCallback((index:number) => {
			scrollRef.current.scrollToIndex({index: index-BLANK_ITEM_OFFSET, animated: true})
		}, [scrollRef])

		useEffect(() => {
			if (onChange && value) {
				onChange(value)
			}
		}, [value])

		useImperativeHandle(ref, () => {
			return {
				setValue(value) {
					const index = data.findIndex(i => i.value === value)
					if (index > -1) {
						scrollTo(index)
					}
				}
			}
		}, [])

		const handleStopScroll = () => {
			if (data[selectedIndex.value].disabled) {
				const toSelect = findNextAvailableIndex(selectedIndex.value)
				if (toSelect === selectedIndex.value) return // No available index
				scrollTo(toSelect)
				return
			}
			setValue(data[selectedIndex.value])
		}

		const handlePress = useCallback((index:number) => {
			if (disabled) return
			scrollTo(index)
		}, [])

		const BlankComponent = () => Array.from(new Array(BLANK_ITEM_OFFSET)).map((_, index) => <View  key={index} style={{width: '100%', height: itemHeight}} />)

		return (
			<View
				style={[
					s.defaultContainer,
					{
						height: itemHeight*NUMBER_OF_ITEMS
					},
					style
				]}
			>
				{showsBar ?
					<View
						style={[
							s.defaultOverlay,
							{height: itemHeight},
							barColor ? {backgroundColor: barColor} : {},
							barStyle ? barStyle : {}
						]}
						pointerEvents={'box-none'}
					/>
					: null
				}

				<FlashList
					ref={scrollRef}
					data={data}
					extraData={{itemHeight, NUMBER_OF_ITEMS}}
					initialScrollIndex={defaultValueIndex}
					estimatedItemSize={itemHeight}
					renderItem={({item, index}) => {
						return <ListItem
							item={item}
							itemHeight={itemHeight}
							handlePress={() => handlePress(index)}
							index={index}
							offset={offset}
							numItems={NUMBER_OF_ITEMS}
							itemDisabledStyle={itemDisabledStyle}
							itemStyle={itemStyle}
							itemDisabledTextStyle={itemDisabledTextStyle}
							itemTextStyle={itemTextStyle}
						/>
					}}
					pagingEnabled
					showsVerticalScrollIndicator={false}
					alwaysBounceVertical={false}
					snapToInterval={itemHeight}
					snapToAlignment={'center'}
					decelerationRate={'fast'}
					scrollEventThrottle={16}
					onScroll={handleScroll}
					ListHeaderComponent={BlankComponent}
					ListFooterComponent={BlankComponent}
					keyExtractor={(item) => `${item.value}`}
					onMomentumScrollEnd={handleStopScroll}
					scrollEnabled={!disabled}
					scrollsToTop={false}
				/>
			</View>
		)
	}
)

const Picker = memo(PickerComponent)
Picker.displayName = 'Picker'
export default Picker

const s = StyleSheet.create({
	defaultOverlay: {
		width: '100%',
		backgroundColor: 'rgba(0,0,0,0.05)',
		borderRadius: 8,
		position: 'absolute'
	},
	defaultContainer: {
		paddingHorizontal: 30,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	}
})