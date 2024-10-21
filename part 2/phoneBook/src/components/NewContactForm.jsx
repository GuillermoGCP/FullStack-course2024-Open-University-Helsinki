import React from 'react'
import personsService from '../services/personsService'

const NewContactForm = ({
    setNewName,
    setNewNumber,
    setPersons,
    newNumber,
    newName,
    persons,
    setSuccessMessage,
    setErrorMessage,
}) => {
    const handleSubmit = (e) => {
        e.preventDefault()
        if (persons.some((person) => person.name === newName)) {
            const userResponse = window.confirm(
                `${newName} is already added to phonebook, replace the old number with a new one?`
            )
            if (!userResponse) {
                setNewName('')
                setNewNumber('')
                return
            } else {
                personsService
                    .update(
                        persons.find((person) => person.name === newName).id,
                        {
                            name: newName,
                            number: newNumber,
                        }
                    )
                    .then((updatedPerson) => {
                        setPersons(
                            persons.map((person) =>
                                person.id === updatedPerson.id
                                    ? updatedPerson
                                    : person
                            )
                        )
                        setNewName('')
                        setNewNumber('')
                        setSuccessMessage(`${newName} updated`)
                        setInterval(() => {
                            setSuccessMessage(null)
                        }, 3000)
                    })
                    .catch((error) => {
                        if (error.status === 404) {
                            console.log(error.message)

                            setErrorMessage(
                                `Information of ${
                                    persons.find(
                                        (person) => person.name === newName
                                    ).name
                                } has been removed from server`
                            )
                            setInterval(() => {
                                setErrorMessage(null)
                            }, 5000)
                        } else {
                            console.log(error.message)
                            setErrorMessage(
                                'Error updating number to contact:',
                                persons.find(
                                    (person) => person.name === newName
                                ).name
                            )
                            setInterval(() => {
                                setErrorMessage(null)
                            }, 5000)
                        }
                    })
                return
            }
        }

        personsService
            .create({ name: newName, number: newNumber })
            .then((newPerson) => {
                setPersons(persons.concat(newPerson))
                setNewName('')
                setNewNumber('')
                setSuccessMessage(`${newName} added to book`)
                setInterval(() => {
                    setSuccessMessage(null)
                }, 5000)
            })
            .catch((error) => {
                console.error('Error adding data to server:', error)
            })
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                name:
                <input
                    type='text'
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
            </div>
            <div>
                number:
                <input
                    type='text'
                    value={newNumber}
                    onChange={(e) => setNewNumber(e.target.value)}
                />
            </div>
            <div>
                <button type='submit'>add</button>
            </div>
        </form>
    )
}

export default NewContactForm
