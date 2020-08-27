<hr/>

# snowpack-plugin-resize-images

> Resize your images with [Sharp](https://sharp.pixelplumbing.com/api-constructor) and [Snowpack](https://snowpack.dev)

```sh
# 🔆 Note there is a peer dependency for Sharp
npm i -D sharp snowpack-plugin-resize-images
```

<p>
  <!--
  <a aria-label="Code coverage report" href="https://codecov.io/gh/jaredLunde/snowpack-plugin-resize-images">
    <img alt="Code coverage" src="https://img.shields.io/codecov/c/gh/jaredLunde/snowpack-plugin-resize-images?style=for-the-badge&labelColor=24292e">
  </a>
  -->
  <a aria-label="Build status" href="https://travis-ci.com/jaredLunde/snowpack-plugin-resize-images">
    <img alt="Build status" src="https://img.shields.io/travis/com/jaredLunde/snowpack-plugin-resize-images?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/snowpack-plugin-resize-images">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/snowpack-plugin-resize-images?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="License" href="https://jaredlunde.mit-license.org/">
    <img alt="MIT License" src="https://img.shields.io/npm/l/snowpack-plugin-resize-images?style=for-the-badge&labelColor=24292e">
  </a>
</p>

---

## Quick start

> 🔆 This plugin resizes images based on matching glob patterns. Your
> image originals will be unaffected as the processing only happens at
> build/dev.
>
> This plugin runs in both `snowpack dev` and `snowpack build`

````js
// snowpack.config.js
module.exports = {
  plugins: [
    [
      'snowpack-plugin-resize-images',
      /** @see "Plugin Options" below */
      {
        /**
         * Glob pattern
         * @see https://github.com/isaacs/node-glob#glob-primer
         */
        '**/300x250/**': {
          /**
           * A Sharp method. This is the same as:
           * ```
           * sharp(input).resize({
           *  width: 300,
           *  height: 250,
           *  options: {
           *   fit: cover
           *  }
           * })
           * ```
           */
          resize: {
            // Sharp method options
            width: 300,
            height: 250,
            options: {
              fit: 'cover',
            },
          },
          /**
           * Another Sharp method. This is chained to the method before it.
           * That is:
           * ```
           * sharp(input).resize({
           *  width: 300,
           *  height: 250,
           *  options: {
           *   fit: cover
           *  }
           * }).jpeg({
           *  quality: 90
           * })
           * ```
           */
          jpeg: {
            quality: 90,
          },
        },
        // Convert all images in the /webp/ directories
        // to webp with a quality of 90
        '**/webp/**': {
          webp: {
            quality: 90,
          },
        },
        '**/placeholder/**': {
          /**
           * This is the same as:
           * ```
           * sharp(INPUT).blur(30)
           * ```
           */
          blur: [30],
        },
      },
    ],
  ],
}
````

#### Plugin Options

```typescript
type SnowpackPluginResizeImagesOptions = {
  /**
   * This is a mapping of glob patterns and their sharp methods
   * and options. See the Sharp documentation for a complete list of
   * methods and their respective options.
   *
   * @see https://sharp.pixelplumbing.com/api-output
   */
  /**
   * Matches image patterns
   */
  [globPattern: string]: {
    /**
     * Chains a method to sharp e.g.
     * `sharp(FILE).sharpMethod()`
     */
    [sharpMethod: string]:
      | {
          /**
           * Adds options to the sharp method e.g.
           * `sharp(FILE).sharpMethod(OPTIONS)`
           */
          [sharpMethodOption: string]: any
        }
      /**
       * Add parameters to the sharp method e.g.
       * sharp(FILE).sharpMethod(...PARAMETERS)
       */
      | any[]
  }
}
```

## LICENSE

MIT
