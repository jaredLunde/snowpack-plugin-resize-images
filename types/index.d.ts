/**
 * This is a mapping of glob patterns and their sharp methods
 * and options. See the Sharp documentation for a complete list of
 * methods and their respective options.
 *
 * @see https://sharp.pixelplumbing.com/api-output
 */
export declare type SnowpackPluginResizeImagesOptions = {
  [globPattern: string]: {
    [sharpMethod: string]: {
      [sharpMethodOption: string]: any
    }
  }
}
