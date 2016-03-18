import Kuzzle from 'kuzzle-sdk'
import Config from '../config'

export default new Kuzzle(Config.kuzzleUrl, {defaultIndex: Config.defaultIndex});
