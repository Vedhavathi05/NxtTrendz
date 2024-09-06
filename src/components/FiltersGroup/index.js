import {BsSearch} from 'react-icons/bs'

import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    onChangeActiveCategoryId,
    onChangeActiveRangeId,
    onChangeSearchInput,
    callTheAPPFunction,
    clearFiltersOfProduct,
    searchInput,
  } = props

  const changeActiveCategory = id => {
    onChangeActiveCategoryId(id)
  }

  const displayingCategory = () => (
    <ul className="removing-the-styles">
      {categoryOptions.map(each => (
        <li
          key={each.categoryId}
          onClick={() => changeActiveCategory(each.categoryId)}
        >
          <p> {each.name}</p>
        </li>
      ))}
    </ul>
  )

  const changeActiveRating = id => {
    onChangeActiveRangeId(id)
  }

  const displayRatingsList = () => (
    <ul className="removing-the-styles">
      {ratingsList.map(each => (
        <li
          key={each.ratingId}
          onClick={() => changeActiveRating(each.ratingId)}
        >
          <div className="display-rating">
            <img
              src={each.imageUrl}
              alt={`rating ${each.ratingId}`}
              className="image-styling"
            />
            <p>& up</p>
          </div>
        </li>
      ))}
    </ul>
  )

  const changeSearchInput = event => {
    onChangeSearchInput(event.target.value)
  }

  const callTheAPI = event => {
    if (event.key === 'Enter' && event.target.value !== '') {
      callTheAPPFunction(true)
    }
  }

  const searchInputFeild = () => (
    <div className="search-border">
      <input
        type="search"
        placeholder="Search"
        className="input-element"
        onChange={changeSearchInput}
        onKeyDown={callTheAPI}
        value={searchInput}
      />
      <BsSearch />
    </div>
  )

  const clearFilters = () => {
    clearFiltersOfProduct(true)
  }

  return (
    <div className="filters-group-container">
      {searchInputFeild()}
      <h1 className="heading">Category</h1>
      {displayingCategory()}
      <h1 className="heading">Rating</h1>
      {displayRatingsList()}
      <button
        type="button"
        className="clear-filters-button-styling"
        onClick={clearFilters}
      >
        Clear Filters
      </button>
    </div>
  )
}
export default FiltersGroup
