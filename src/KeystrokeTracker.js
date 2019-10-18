class KeystrokeTracker {
    constructor() {
        this.Events = [];
        this.keys = " ,.'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        this.Table = [];
    }

    KeyDown(key) {
        this.Events.push(
            {
                time: new Date(),
                key: key
            }
        );
    }

    Sumarize() {
        const pre_table = this.Events
            .filter((obj) => this.keys.indexOf(obj.key) >= 0)
            .map((current, index, array) => {
                if (index >= array.length - 1)
                    return {};

                const next = array[index + 1];
                const keypair = `${current.key}${next.key}`;
                const timediff = next.time - current.time;

                return { keypair, timediff };
            }).reduce((acc, obj) => {
                if (!acc[obj.keypair]) {
                    acc[obj.keypair] = {
                        keypair: obj.keypair,
                        timediff: [],
                    }
                }

                acc[obj.keypair].timediff.push(obj.timediff);

                return acc;
            }, {});

        this.table = Object.keys(pre_table)
            .map(key => {
                pre_table[key].avg = pre_table[key].timediff.reduce((a, v) => (a = a + v), 0) / pre_table[key].timediff.length;
                return pre_table[key];
            });        

        return this.table.filter(item => item.keypair != undefined);
    }
}

export default KeystrokeTracker