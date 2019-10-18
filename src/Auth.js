class Auth {
    static Auth1NN(users, table){
        let prob = [];
        let dist = table.flatMap(obj => {
            let ds = [];
            for(var user in users){
                let v = users[user][obj.keypair];
                if(!v)
                    return;

                let d = Math.sqrt(Math.pow(v.avg - obj.avg, 2));
                ds.push({user, d:d, keypair:obj.keypair});
            }
                
            return ds;
        });

        for(var i in table){
            let closer = dist.filter(d => d != undefined).filter(d => d.keypair === table[i].keypair)
                .reduce((acc, v) => {
                    if(!acc.d){
                        return v;
                    }

                    if(acc.d >= v.d)
                        return v;
                    
                    return acc;
                }, {});
            prob.push(closer.user);
        }
        
        var uu = prob.filter(d => d != undefined).filter((v, i, a) => a.indexOf(v) === i);
        const result = uu.map(u => ({user:u, prob: prob.filter(v => v === u).length / prob.length}));
        console.log(prob, result);

        return result;
    }
}

export default Auth