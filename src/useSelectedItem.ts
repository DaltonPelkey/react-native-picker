import {useCallback, useRef} from 'react'
import {NativeScrollEvent, NativeSyntheticEvent} from 'react-native'
import {useDerivedValue, useSharedValue} from 'react-native-reanimated'
import {FlashList} from '@shopify/flash-list'
import {PickerItem} from './Picker'

export function useSelectedItem(itemHeight:number, dataLength:number) {

	const offset = useSharedValue(0)
	const selectedIndex = useDerivedValue(() => {
		const index = Math.ceil(offset.value/itemHeight)
		return index < 0 ? 0 : index > dataLength-1 ? dataLength-1 : index
	})

	const scrollRef = useRef<FlashList<PickerItem>>(null!)

	const handleScroll = useCallback((e:NativeSyntheticEvent<NativeScrollEvent>) => {
		offset.value = e.nativeEvent.contentOffset.y
	}, [])

	return {
		handleScroll,
		scrollRef,
		selectedIndex,
		offset
	}
}