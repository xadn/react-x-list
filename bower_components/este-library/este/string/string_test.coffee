suite 'este.string', ->

  string = este.string

  suite 'toFancyUrl', ->
    test 'should rewrite string to be usable as url', ->
      assert.equal 'escrzyaie', string.toFancyUrl 'ěščřžýáíé'
      assert.equal 'ou-jee', string.toFancyUrl 'Ou jee'
      assert.equal 'ou-jee', string.toFancyUrl '  Ou jee'
      assert.equal 'ou-jee', string.toFancyUrl 'Ou jee  '
      assert.equal 'foo-bla', string.toFancyUrl 'foo-bla'
      assert.equal 'foo-bla', string.toFancyUrl 'foo--bla'
      assert.equal 'foo-bla', string.toFancyUrl '-foo-bla'
      assert.equal 'foo-bla', string.toFancyUrl 'foo-bla-'
      assert.equal '', string.toFancyUrl '@#$'
      assert.equal '100', string.toFancyUrl '100%'
      assert.equal '100', string.toFancyUrl '100 %'

  suite 'chunk', ->
    chunked = null
    arrange = (str) ->
      chunked = string.chunk str, 2

    test 'should not chunk string less than 2', ->
      arrange 'f'
      assert.lengthOf chunked, 1
      assert.equal chunked[0], 'f'

    test 'should not chunk string equal than 2', ->
      arrange 'fo'
      assert.lengthOf chunked, 1
      assert.equal chunked[0], 'fo'

    test 'should chunk string greater than 2', ->
      arrange 'foo'
      assert.lengthOf chunked, 2
      assert.equal chunked[0], 'fo'
      assert.equal chunked[1], 'o'

  suite 'chunkToObject', ->
    chunked = null
    arrange = (str) ->
      chunked = string.chunkToObject str, 2

    test 'should not chunk string less than 2', ->
      arrange 'f'
      assert.lengthOf chunked, 1
      assert.equal chunked[0].text, 'f'
      assert.equal chunked[0].index, 0
      assert.equal chunked[0].total, 1

    test 'should not chunk string equal than 2', ->
      arrange 'fo'
      assert.lengthOf chunked, 1
      assert.equal chunked[0].text, 'fo'
      assert.equal chunked[0].index, 0
      assert.equal chunked[0].total, 1

    test 'should chunk string greater than 2', ->
      arrange 'foo'
      assert.lengthOf chunked, 2
      assert.equal chunked[0].text, 'fo'
      assert.equal chunked[0].index, 0
      assert.equal chunked[0].total, 2
      assert.equal chunked[1].text, 'o'
      assert.equal chunked[1].index, 1
      assert.equal chunked[1].total, 2

  suite 'stripSlashHashPrefixes', ->
    test 'should strip slashes and hashes on string start', ->
      data =
        '': ''
        'foo': 'foo'
        '//foo': 'foo'
        '##foo': 'foo'
        '#/foo': 'foo'

      for path, token of data
        assert.equal string.stripSlashHashPrefixes(path), token
      return