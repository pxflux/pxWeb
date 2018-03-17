import { PlayerArtwork } from './PlayerArtwork'

/**
 * @property {?string} key
 * @property {?string} pin
 * @property {?PlayerArtwork} artwork
 */
export class Player {
  constructor (key, pin, artwork) {
    this.key = key || null
    this.pin = pin || null
    this.artwork = artwork
  }

  static empty () {
    return new Player(null, null, PlayerArtwork.empty())
  }

  /**
   * @param {object} value
   */
  static fromJson (value) {
    if (!value && typeof value !== 'object') {
      return null
    }
    const id = value.hasOwnProperty('.key') ? value['.key'] : value.key
    return new Player(id, value.pin, PlayerArtwork.fromJson(value.artwork))
  }

  /**
   * @param {string} artworkId
   * @return {boolean}
   */
  isArtworkLaunched (artworkId) {
    if (!this.artwork) {
      return false
    }
    return artworkId === this.artwork.key
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries (prefix) {
    const data = {}
    data[prefix + 'pin'] = this.pin
    Object.assign(data, PlayerArtwork.toEntries(prefix + 'artwork/', this.artwork))
    return data
  }

  /**
   * @param {string} prefix
   * @param {Player} original
   * @return {Object}
   */
  toUpdates (prefix, original) {
    const data = this.toEntries(prefix)
    this.updatedEntries(prefix, data, original)
    return data
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {Player} original
   */
  updatedEntries (prefix, data, original) {
    if (this.pin === original.pin) {
      delete data[prefix + 'pin']
    }
    this.artwork.updatedEntries(prefix + 'artwork/', data, original.artwork)
  }
}