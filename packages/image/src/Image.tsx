import {
  GetProps,
  RadiusTokens,
  SizeTokens,
  StackProps,
  ThemeValueFallback,
  isWeb,
  setupReactNative,
  styled,
  useMediaPropsActive,
} from '@tamagui/core'
import React, { forwardRef } from 'react'
import { Image as RNImage } from 'react-native'

setupReactNative({
  Image: RNImage,
})

const StyledImage = styled(RNImage, {
  name: 'Image',
  position: 'relative',
  source: { uri: '' },
  zIndex: 1,
})

type StyledImageProps = Omit<GetProps<typeof StyledImage>, 'borderRadius'> & {
  borderRadius?: RadiusTokens
}

type BaseProps = Omit<StyledImageProps, 'width' | 'height' | 'style' | 'onLayout'> & {
  width?: string | number | SizeTokens | ThemeValueFallback
  height?: string | number | SizeTokens | ThemeValueFallback

  /**
   * @deprecated use `source` instead to disambiguate width/height style from width/height of the actual image
   */
  src?: string | StyledImageProps['source']
}

export type ImageProps = BaseProps & Omit<StackProps, keyof BaseProps>

type RNImageType = typeof RNImage

type ImageType = React.FC<ImageProps> & {
  getSize: RNImageType['getSize']
  getSizeWithHeaders: RNImageType['getSizeWithHeaders']
  prefetch: RNImageType['prefetch']
  prefetchWithMetadata: RNImageType['prefetchWithMetadata']
  abortPrefetch: RNImageType['abortPrefetch']
  queryCache: RNImageType['queryCache']
}

let hasWarned = false

export const Image = StyledImage.extractable(
  forwardRef((inProps: ImageProps, ref) => {
    const props = useMediaPropsActive(inProps)
    const { src, source, ...rest } = props

    if (process.env.NODE_ENV === 'development') {
      if (typeof src === 'string') {
        if (
          (typeof props.width === 'string' && props.width[0] !== '$') ||
          (typeof props.height === 'string' && props.height[0] !== '$')
        ) {
          if (!hasWarned) {
            hasWarned = true
            console.warn(
              `React Native expects a numerical width/height. If you want to use a percent you must define the "source" prop with width, height, and uri.`
            )
          }
        }
      }
    }

    const finalSource =
      typeof src === 'string'
        ? { uri: src, ...(isWeb && { width: props.width, height: props.height }) }
        : source ?? src

    // must set defaultSource to allow SSR, default it to the same as src
    return <StyledImage ref={ref} source={finalSource} {...(rest as any)} />
  })
) as any as ImageType

Image.getSize = RNImage.getSize
Image.getSizeWithHeaders = RNImage.getSizeWithHeaders
Image.prefetch = RNImage.prefetch
Image.prefetchWithMetadata = RNImage.prefetchWithMetadata
Image.abortPrefetch = RNImage.abortPrefetch
Image.queryCache = RNImage.queryCache
