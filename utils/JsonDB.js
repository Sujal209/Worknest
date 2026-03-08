const fs = require('fs');
const path = require('path');

// In-memory store for Vercel (serverless environment)
const inMemoryStore = {};

class JsonDB {
    constructor(collectionName) {
        this.collectionName = collectionName;
        this.sourcePath = path.join(__dirname, '../data', `${collectionName}.json`);
        
        // Use /tmp for writable storage on Vercel
        const tmpDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, '../data');
        this.dirPath = tmpDir;
        this.filePath = path.join(tmpDir, `${collectionName}.json`);
        
        // Initialize in-memory store from source data
        if (!inMemoryStore[collectionName]) {
            try {
                const sourceData = fs.readFileSync(this.sourcePath, 'utf8');
                inMemoryStore[collectionName] = JSON.parse(sourceData);
            } catch {
                inMemoryStore[collectionName] = [];
            }
        }
    }

    ensureDir() {
        // Only try to create dir if not in Vercel (local dev)
        if (!process.env.VERCEL && !fs.existsSync(this.dirPath)) {
            fs.mkdirSync(this.dirPath, { recursive: true });
        }
    }

    async read() {
        // Always read from in-memory store first
        return inMemoryStore[this.collectionName] || [];
    }

    async write(data) {
        // Update in-memory store
        inMemoryStore[this.collectionName] = data;
        
        // Try to write to /tmp on Vercel (optional - data won't persist between invocations)
        if (process.env.VERCEL) {
            try {
                fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
            } catch (err) {
                // Silent fail - data is still in memory
                console.log(`Notice: Could not write to ${this.filePath}, data stored in memory only`);
            }
        } else {
            // Local development - write to data directory
            fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
        }
    }

    async find(query = {}) {
        const data = await this.read();
        return data.filter(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
        });
    }

    async findOne(query = {}) {
        const data = await this.read();
        return data.find(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
        }) || null;
    }

    async findById(id) {
        const data = await this.read();
        return data.find(item => item.id === id || item._id === id) || null;
    }

    async save(item) {
        const data = await this.read();
        if (!item.id && !item._id) {
            item.id = Date.now().toString();
            item._id = item.id;
            item.createdAt = new Date().toISOString();
            data.push(item);
        } else {
            const index = data.findIndex(i => (i.id === item.id || i._id === item._id));
            if (index !== -1) {
                data[index] = { ...data[index], ...item };
            } else {
                data.push(item);
            }
        }
        await this.write(data);
        return item;
    }

    async findByIdAndUpdate(id, update) {
        const data = await this.read();
        const index = data.findIndex(item => (item.id === id || item._id === id));
        if (index === -1) return null;
        data[index] = { ...data[index], ...update };
        await this.write(data);
        return data[index];
    }

    async findByIdAndDelete(id) {
        const data = await this.read();
        const index = data.findIndex(item => (item.id === id || item._id === id));
        if (index === -1) return null;
        const deletedItem = data.splice(index, 1)[0];
        await this.write(data);
        return deletedItem;
    }
}

module.exports = JsonDB;
