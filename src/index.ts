/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path'
import {promisify} from 'util'
import {promises as fs} from 'fs'
import glob_ from 'glob'
import sharp from 'sharp'

const glob = promisify(glob_)

module.exports = function plugin(
  _: any,
  images: SnowpackPluginResizeImagesOptions
) {
  return {
    name: 'snowpack-plugin-resize-images',
    async optimize({buildDirectory}: {buildDirectory: string}) {
      const results: Promise<any>[] = []

      for (const globPattern in images) {
        const files = await glob(globPattern, {
          cwd: buildDirectory,
          absolute: true,
        })
        const methods = images[globPattern]

        for (const file of files) {
          const extname = path.extname(file)
          const tmpFile = file.replace(
            extname,
            '.snowpack-plugin-resize-images' + extname
          )
          await fs.copyFile(file, tmpFile)
          const base = sharp(tmpFile)

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

          results.push(
            base.toFile(file).then(() => {
              fs.unlink(tmpFile)
            })
          )

          if (results.length === 8) {
            await Promise.all(results)
            results.length = 0
          }
        }
      }
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
