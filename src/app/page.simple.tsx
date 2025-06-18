export default function Home() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>AgênciaOS - Login</h1>
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Login</h2>
        <form>
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="email" 
              placeholder="Email" 
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="password" 
              placeholder="Senha" 
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <button 
            type="submit"
            style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Entrar
          </button>
        </form>
        <p style={{ marginTop: '20px' }}>
          <a href="#" style={{ color: '#0070f3' }}>Criar conta</a>
        </p>
      </div>
    </div>
  )
}