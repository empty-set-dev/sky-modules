import { dirname } from 'path'

import { findSkyConfig } from './loadSkyConfig'

const skyConfigPath = findSkyConfig()
const workspaceRoot = skyConfigPath ? dirname(dirname(skyConfigPath)) : null

export default workspaceRoot
