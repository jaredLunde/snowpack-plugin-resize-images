/* eslint-disable @typescript-eslint/no-var-requires */
import micromatch from 'micromatch'
import sharp from 'sharp'

module.exports = function plugin(
  _: any,
  images: SnowpackPluginResizeImagesOptions
) {
  return {
    name: 'snowpack-plugin-resize-images',
    async transform({contents, id: filePath}: {contents: any; id: string}) {
      let base

      for (const globPattern in images) {
        if (micromatch.isMatch(filePath, globPattern)) {
          base = base || sharp(Buffer.from(contents, 'binary'))
          const methods = images[globPattern]

          for (const method in methods) {
            const methodOptions = methods[method]

            if (Array.isArray(methodOptions)) {
              // @ts-ignore
              base[method](...methodOptions)
            } else {
              // @ts-ignore
              base[method](methodOptions)
            }
          }

          if (base) {
            return (await base.toBuffer()).toString('binary')
          }

          return contents
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
