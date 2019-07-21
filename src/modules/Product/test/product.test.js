import Product from '../product.model'
const chai = require('chai')
const expect = chai.expect

describe('product graphql test', () => {
  it('get products', done => {
    chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          query{
            products{
              id
             }
           }`
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        const data = res.body.data.products
        expect(data).is.to.be.an('array')
        done()
      })
  })

  it('get product', async () => {
    const findproduct = await Product.findOne({ name: 'product_test' })
    const result = await chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          query{
            product(id: "${findproduct._id}"){
              id
             }
           }`
      })

    const status = result.status
    expect(status).to.be.equal(200)
    const data = result.body.data
    expect(data).is.to.be.an('object')
  })

  it('add product', async () => {
    const name = 'testSize'
    const slug = 'testSize'
    const description = 'testSize'
    const isPublic = 'testSize'
    const status = false
    try {
      const result = await chai
        .sendLocalRequest()
        .post('/graphql')
        .set('Accept', 'application/json')
        .send({
          query: `
          mutation{
            addProduct(
              name: ${name},
              slug: ${slug},
              description: ${description},
              isPublic: ${isPublic},
              status: ${status}
            ){
              id
             }
           }`
        })
      expect(result.status).is.equal(200)
      const data = result.body.data
      expect(data).is.to.be.an('object')
    } catch (error) {
      if (error) return error
    }
  })

  it('delete product', async () => {
    const product = (await Product.find({})) || []
    const newproduct = product[0] || {}
    const result = await chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          mutation{
            deleteProduct(id: "${newproduct._id}")
           }`
      })
    const status = result.status
    expect(status).to.be.equal(200)
    const data = result.body.data
    expect(data).is.to.be.an('object')
    expect(data.deleteProduct).is.to.be.equal(true)
  })
})
