export class GhitUser {
    static searsh(userame) {
        const endPoint = `https://api.github.com/users/${userame}`
        return fetch (endPoint).then(data => data.json())
        .then(({login, html_url, name, public_repos, followers}) => ({
            login,
            html_url,
            name,
            public_repos,
            followers,
        })) 
    }
}





export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }
    
    load() {
        this.users = JSON.parse(localStorage.getItem("@github-favorites:")) || []
    }
    save() {
        localStorage.setItem("@github-favorites:", JSON.stringify(this.users))
    }
    
    async add(username) {
        
        try {
            const userAdded = this.users.find(entry => entry.login === username)
            if (userAdded) {
                throw new Error("usuario ja favoritado")
            }

            const user = await GhitUser.searsh(username)
            
            if (user.login == undefined) {
                throw new Error("usuario não encontrado")
            }    
            
            this.users = [user, ...this.users]
            console.log(this.users)
            this.updade()
            this.save()
            }catch(error) {
                alert(error.message)
             }
         
            }
            
            

   delete(user) {
       const filteredUsers = this.users.filter(entry => entry.login !== user.login)
    this.users = filteredUsers
    this.updade()
    this.save()
   } 

}


export class FavoritesView  extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody')
        this.updade()
        this.onFav()
    }


    onFav() {
        const favButton = this.root.querySelector("#searsh-button")
      favButton.onclick = () => {const {value} = this.root.querySelector("#inpt-search")
      this.add(value)
    }
       
    }


    updade() {
        this.removeAllTr()
        this.users.forEach(user => {const row = this.createRow()
        
        row.querySelector(".user img").src = `https://github.com/${user.login}.png` 
        row.querySelector(".user img").alt = `imagem de perfiel de ${user.name}`
        row.querySelector(".user a").textContent = user.name
        row.querySelector(".user a").href =` https://github.com/${user.login}`
        row.querySelector(".user span").textContent = `/${user.login}`
        row.querySelector(".repositories").textContent = user.public_repos
        row.querySelector(".followers").textContent = user.followers
        row.querySelector(".remove").addEventListener("click", () => {
         const xButton = confirm("tem certeza de que deseja removar esse favorito?")
          if(xButton) {
            this.delete(user)
          }})
        this.tbody.append(row)
        }
    )
        
    }
    createRow() {
        const tr = document.createElement("tr")

        tr.innerHTML = `
        <td class="user"><img src=x" alt="imagem de perfil"><div class="textBox"><a href=""></a> <span></span> </div> </td>
        <td class="repositories"> x repositorios</td>
        <td class="followers"> x seguidores</td>
        <td class="remove"><button>X</button></td>
        `

        return tr
    }
    
    removeAllTr() {
    
        
        this.tbody.querySelectorAll("tr").forEach((tr) => {
            tr.remove()
        })
        
    }
}