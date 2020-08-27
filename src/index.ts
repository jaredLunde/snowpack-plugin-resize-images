/* eslint-disable @typescript-eslint/no-var-requires */
import micromatch from 'micromatch'
import sharp from 'sharp'

module.exports = function plugin(
  _: any,
  images: SnowpackPluginResizeImagesOptions
) {
  return {
    name: 'snowpack-plugin-resize-images',
    async transform({contents, filePath}: {contents: any; filePath: string}) {
      for (const globPattern in images) {
        if (micromatch.isMatch(filePath, globPattern)) {
          const base = sharp(Buffer.from(contents, 'binary'))
          const methods = images[globPattern]

          for (const method in methods) {
            const methodOptions = methods[method]
            if (Array.isArray(methodOptions)) {
              // eslint-disable-next-line @typescript-eslint/no-extra-semi
              ;(base as any)[method](...methodOptions)
            } else {
              // eslint-disable-next-line @typescript-eslint/no-extra-semi
              ;(base as any)[method](methodOptions)
            }
          }

          return (await base.toBuffer()).toString('binary')
        }
      }

      return contents
    },
  }
}

/**
 * This is a mapping of glob patterns and their sharp methods
 * and options. See the Sharp documentation for a complete list of
 * methods and their respective options.
 *
 * @see https://sharp.pixelplumbing.com/api-output
 */
export type SnowpackPluginResizeImagesOptions = {
  [globPattern: string]: {
    [sharpMethod: string]:
      | {
          [sharpMethodOption: string]: any
        }
      | any[]
  }
}
