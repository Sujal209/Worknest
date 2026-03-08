const fs = require('fs');
const path = require('path');

class JsonDB {
    constructor(collectionName) {
        this.dirPath = path.join(__dirname, '../data');
        this.filePath = path.join(this.dirPath, `${collectionName}.json`);
        this.ensureDir();
    }

    ensureDir() {
        if (!fs.existsSync(this.dirPath)) {
            fs.mkdirSync(this.dirPath, { recursive: true });
        }
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
        }
    }

    async read() {
        const data = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(data);
    }

    async write(data) {
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
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
