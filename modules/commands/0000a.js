const fs = require('fs'),
  path = require('path'),
  request = require('request'),
  image_dimensions = {
    width: 768,
    height: 768,
  }
module.exports = {
  config: {
    name: 'midjourney',
    version: '1.0.0',
    hasPermission: 0,
    credits: 'Aliester Crowley',
    description: 'AI Image Generation',
    commandCategory: 'Misc',
    usages: '[generate ai image]',
    cooldowns: 3,
  },
  run: async ({ api: _0x5c3def, event: _0x407061, args: _0x3618a1 }) => {
    try {
      if (_0x3618a1.length === 0) {
        _0x5c3def.sendMessage(
          '\u26A0ï¸ Please provide a prompt.\n\nExample:\n' +
            global.config.PREFIX +
            'midjourney a beautiful elf, mythical, highly detailed, art station, 4k, cinematic lighting.',
          _0x407061.threadID
        )
        return
      }
      await _0x5c3def.sendMessage(
        '\u2705 Processing your prompt. Please wait...',
        _0x407061.threadID
      )
      const _0x117b46 = _0x3618a1.join(' '),
        _0x2e6172 = await fetchImageUrl(_0x117b46),
        _0x402321 = await downloadImage(_0x2e6172)
      await sendImage(_0x5c3def, _0x407061, _0x117b46, _0x402321)
      cleanupImage(_0x402321)
    } catch (_0x28b947) {
      console.error('Error:', _0x28b947)
      _0x5c3def.sendMessage(
        'There was an error fetching the image. Please try again later.',
        _0x407061.threadID
      )
    }
  },
}
async function fetchImageUrl(_0x56a4cf) {
  const _0x2ec02c = (await import('midjourney-client')).default,
    _0x53bc87 = await _0x2ec02c(
      'mdjrny-v4 style ' + _0x56a4cf,
      image_dimensions
    )
  console.log('Midjourney Client response:', _0x53bc87)
  if (!Array.isArray(_0x53bc87) || _0x53bc87.length === 0) {
    throw new Error('Invalid imageUrl value')
  }
  const _0x18845c = _0x53bc87[0]
  if (
    !_0x18845c ||
    typeof _0x18845c !== 'string' ||
    !_0x18845c.startsWith('http')
  ) {
    throw new Error('Invalid imageUrl value')
  }
  return _0x18845c
}
async function downloadImage(_0x25850e) {
  return new Promise((_0x589271, _0x5bca23) => {
    const _0x183260 = path.extname(_0x25850e),
      _0xd2727 = 'crowgenai' + _0x183260,
      _0x32c27a = path.join(__dirname, 'cache')
    !fs.existsSync(_0x32c27a) && fs.mkdirSync(_0x32c27a)
    const _0x42b141 = path.join(_0x32c27a, _0xd2727),
      _0x35851a = fs.createWriteStream(_0x42b141)
    request(_0x25850e).pipe(_0x35851a)
    _0x35851a.on('finish', () => _0x589271(_0x42b141))
    _0x35851a.on('error', (_0x3d3211) => _0x5bca23(_0x3d3211))
  })
}
async function sendImage(_0x1dc0d0, _0x52a5cb, _0x3c9c24, _0x41a5e6) {
  try {
    const _0x35b69a = {
      body: 'Your prompt: ' + _0x3c9c24,
      attachment: fs.createReadStream(_0x41a5e6),
    }
    await _0x1dc0d0.sendMessage(
      _0x35b69a,
      _0x52a5cb.threadID,
      _0x52a5cb.messageID
    )
  } catch (_0x5ed278) {
    console.error('Error sending message:', _0x5ed278)
  }
}
function cleanupImage(_0x477ccf) {
  try {
    fs.unlinkSync(_0x477ccf)
  } catch (_0x2411d4) {
    console.error('Error removing image file:', _0x2411d4)
  }
}