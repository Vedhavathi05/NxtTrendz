import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    activeCategoryId: '',
    activeRatingID: '',
    searchInput: '',
    stateOftheApi: 'INACTIVE',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    const {activeCategoryId, activeRatingID, searchInput} = this.state
    this.setState({
      stateOftheApi: 'PROGRESS',
    })
    const jwtToken = Cookies.get('jwt_token')

    const {activeOptionId} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInput}&rating=${activeRatingID}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      if (updatedData.length !== 0) {
        this.setState({
          productsList: updatedData,
          stateOftheApi: 'SUCCESS',
        })
      } else {
        this.setState({
          stateOftheApi: 'NOPRODUCTS',
        })
      }
    } else {
      this.setState({stateOftheApi: 'FAILURE'})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onChangeActiveCategoryId = id => {
    this.setState({activeCategoryId: id}, this.getProducts)
  }

  onChangeActiveRangeId = id => {
    this.setState({activeRatingID: id}, this.getProducts)
  }

  onChangeSearchInput = value => {
    this.setState({searchInput: value})
  }

  callTheAPPFunction = bool => {
    if (bool === true) {
      this.getProducts()
    }
  }

  clearFiltersOfProduct = bool => {
    if (bool === true) {
      this.setState(
        {
          activeCategoryId: '',
          activeRatingID: '',
          searchInput: '',
        },
        this.getProducts,
      )
    }
  }

  noProductsView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
      />
      <h1>No Products Found</h1>
      <p>We could not find any products. Try with other filters.</p>
    </div>
  )

  failureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  showRespectivewView = () => {
    const {stateOftheApi} = this.state
    switch (stateOftheApi) {
      case 'PROGRESS':
        return this.renderLoader()
      case 'SUCCESS':
        return this.renderProductsList()
      case 'NOPRODUCTS':
        return this.noProductsView()
      case 'FAILURE':
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <div className="all-products-section">
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          onChangeActiveCategoryId={this.onChangeActiveCategoryId}
          onChangeActiveRangeId={this.onChangeActiveRangeId}
          onChangeSearchInput={this.onChangeSearchInput}
          callTheAPPFunction={this.callTheAPPFunction}
          clearFiltersOfProduct={this.clearFiltersOfProduct}
          searchInput={searchInput}
        />

        {this.showRespectivewView()}
      </div>
    )
  }
}

export default AllProductsSection
