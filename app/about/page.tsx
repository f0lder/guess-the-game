import Menu from "@/components/Menu";

export default function About() {
    return (
        
        <div>
            <Menu />
            <div className="flex flex-col justify-center items-center">
                <div>
                    <p className="text-4xl font-bold m-2">Despre aplicatie</p>
                    <p className="m-2">
                        Aplicatie realizata pentru Programare web de Ursan Bogdan-Gabriel
                        
                    </p>

                    <p className="m-2">Tehnologii folosite:</p>
                    <ul className="list-disc list-inside space-y-1 m-3">
                        <li className="text-lg text-blue-500">Next.JS</li>
                        <li className="text-lg text-blue-500">React</li>
                        <li className="text-lg text-blue-500">Typescript</li>
                        <li className="text-lg text-blue-500">TailwindCSS</li>
                        <li className="text-lg text-blue-500">API de la <a className="underline" href="https://rawg.io/">RAWG</a></li>
                    </ul>

                    <p className="m-2">Link catre repo: <a className="border border-blue-500 rounded p-1" href="https://github.com/f0lder/guess-the-game" target="_black"> f0lder/guess-the-game </a></p>
                </div>
                
            </div>
            
        </div>
    )
}
