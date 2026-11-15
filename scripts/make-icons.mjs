// Tạo icon PNG từ public/icons/favicon.svg. Chạy: node scripts/make-icons.mjs
import sharp from 'sharp'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const svg = await readFile(new URL('../public/icons/favicon.svg', import.meta.url))
// apple-touch-icon không bo góc (iOS tự bo), nền hồng phủ kín
const square = Buffer.from(svg.toString().replace('rx="44"', 'rx="0"'))

const out = (name) => fileURLToPath(new URL(`../public/icons/${name}`, import.meta.url))
await sharp(square, { density: 300 }).resize(180, 180).png().toFile(out('apple-touch-icon.png'))
await sharp(square, { density: 300 }).resize(192, 192).png().toFile(out('icon-192.png'))
await sharp(square, { density: 300 }).resize(512, 512).png().toFile(out('icon-512.png'))
console.log('Đã tạo icon xong')
